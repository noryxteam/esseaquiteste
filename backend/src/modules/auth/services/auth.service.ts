import bcrypt from "bcryptjs";
import { prisma } from "@/database";
import type { User } from "@prisma/client";
import { ForbiddenError, UnauthorizedError } from "@/shared/types/errors";
import { auditService } from "@/shared/services/audit.service";
import { logger } from "@/shared/services/logger.service";
import { loginAttemptRepository } from "@/modules/auth/repositories/login-attempt.repository";
import { passwordResetRepository } from "@/modules/auth/repositories/password-reset.repository";
import { sessionRepository } from "@/modules/auth/repositories/session.repository";
import type { AuthUserProfile, DeviceInfo, LoginResult, SessionInfo } from "@/modules/auth/types/auth.types";
import { getPermissionsForRole, ROLE_LABELS } from "@/modules/auth/types/permissions";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
} from "@/modules/auth/validators/auth.validator";
import { getRefreshExpiryDate, parseDeviceName, parseDeviceType } from "@/modules/auth/utils/device.utils";
import {
  generateAccessToken,
  generateRefreshTokenValue,
  generateResetTokenValue,
  mapUserTypeFromRole,
} from "@/modules/auth/utils/token.utils";
import { env } from "@/config";

const MAX_LOGIN_ATTEMPTS = 5;

function toProfile(user: User): AuthUserProfile {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    roleLabel: ROLE_LABELS[user.role],
    userType: user.userType,
    status: user.status,
    cargo: user.cargo,
    empresa: user.empresa,
    avatar: user.avatar,
    ativo: user.ativo,
    permissions: getPermissionsForRole(user.role),
    mfaEnabled: user.mfaEnabled,
  };
}

function assertAccountActive(user: User) {
  if (user.deletedAt) {
    throw new ForbiddenError("Conta não encontrada.", "ACCOUNT_NOT_FOUND");
  }
  if (user.status === "BLOCKED") {
    throw new ForbiddenError("Conta bloqueada. Entre em contato com o suporte.", "ACCOUNT_BLOCKED");
  }
  if (user.status === "PENDING") {
    throw new ForbiddenError("Conta pendente de ativação.", "ACCOUNT_PENDING");
  }
  if (!user.ativo || user.status === "INACTIVE") {
    throw new ForbiddenError("Conta inativa.", "ACCOUNT_INACTIVE");
  }
}

export class AuthService {
  async login(input: LoginInput, device: DeviceInfo): Promise<LoginResult> {
    const failures = await loginAttemptRepository.countRecentFailures(input.email);
    if (failures >= MAX_LOGIN_ATTEMPTS) {
      throw new ForbiddenError(
        "Muitas tentativas de login. Tente novamente em alguns minutos.",
        "TOO_MANY_ATTEMPTS"
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
    });

    if (!user) {
      await loginAttemptRepository.record({
        email: input.email,
        success: false,
        ip: device.ip,
        userAgent: device.userAgent,
        reason: "USER_NOT_FOUND",
      });
      await auditService.log({
        action: "LOGIN_FAILED",
        entity: "User",
        metadata: { email: input.email, reason: "invalid_credentials" },
        ip: device.ip,
        userAgent: device.userAgent,
      });
      throw new UnauthorizedError("Credenciais inválidas.", "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      await loginAttemptRepository.record({
        email: input.email,
        userId: user.id,
        success: false,
        ip: device.ip,
        userAgent: device.userAgent,
        reason: "INVALID_PASSWORD",
      });
      await auditService.log({
        userId: user.id,
        action: "LOGIN_FAILED",
        entity: "User",
        entityId: user.id,
        ip: device.ip,
        userAgent: device.userAgent,
      });
      throw new UnauthorizedError("Credenciais inválidas.", "INVALID_CREDENTIALS");
    }

    try {
      assertAccountActive(user);
    } catch (error) {
      await loginAttemptRepository.record({
        email: input.email,
        userId: user.id,
        success: false,
        ip: device.ip,
        userAgent: device.userAgent,
        reason: "ACCOUNT_INACTIVE",
      });
      throw error;
    }

    const expiresAt = getRefreshExpiryDate(input.rememberMe);
    const session = await sessionRepository.create({
      userId: user.id,
      deviceName: parseDeviceName(device.userAgent, input.deviceName),
      deviceType: device.deviceType ?? parseDeviceType(device.userAgent),
      userAgent: device.userAgent,
      ip: device.ip,
      rememberMe: input.rememberMe,
      expiresAt,
    });

    const refreshTokenValue = generateRefreshTokenValue();
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        sessionId: session.id,
        expiresAt,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      sessionId: session.id,
    });

    await loginAttemptRepository.record({
      email: input.email,
      userId: user.id,
      success: true,
      ip: device.ip,
      userAgent: device.userAgent,
    });
    await auditService.logLogin(user.id, device.ip, device.userAgent);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: env.JWT_EXPIRES_IN,
      sessionId: session.id,
      user: toProfile(user),
    };
  }

  async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true, session: true },
    });

    if (!stored || !stored.session || stored.session.revokedAt) {
      throw new UnauthorizedError("Sessão inválida ou expirada.", "INVALID_SESSION");
    }

    assertAccountActive(stored.user);
    await sessionRepository.touch(stored.session.id);

    const accessToken = generateAccessToken({
      userId: stored.user.id,
      role: stored.user.role,
      sessionId: stored.session.id,
    });

    return { accessToken, expiresIn: env.JWT_EXPIRES_IN };
  }

  async logout(refreshToken: string, userId?: string, allDevices = false, ip?: string, userAgent?: string) {
    const stored = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { session: true },
    });

    if (stored?.sessionId) {
      await sessionRepository.revoke(stored.sessionId);
    }

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });

    if (allDevices && userId) {
      await sessionRepository.revokeAllForUser(userId);
      await prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    if (userId) {
      await auditService.log({
        userId,
        action: "LOGOUT",
        entity: "User",
        entityId: userId,
        metadata: { allDevices },
        ip,
        userAgent,
      });
    }
  }

  async getMe(userId: string): Promise<AuthUserProfile> {
    const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user) throw new UnauthorizedError("Usuário não encontrado.", "USER_NOT_FOUND");
    assertAccountActive(user);
    return toProfile(user);
  }

  async forgotPassword(input: ForgotPasswordInput, ip?: string, userAgent?: string) {
    const user = await prisma.user.findFirst({ where: { email: input.email, deletedAt: null } });
    const message = "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.";

    if (!user) return { message };

    const token = generateResetTokenValue();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await passwordResetRepository.create(user.id, token, expiresAt);

    await auditService.log({
      userId: user.id,
      action: "PASSWORD_RESET_REQUEST",
      entity: "User",
      entityId: user.id,
      ip,
      userAgent,
    });

    logger.info("Mock e-mail: recuperação de senha", {
      email: user.email,
      resetUrl: `/nova-senha?token=${token}`,
      expiresAt,
    });

    return {
      message,
      ...(process.env.NODE_ENV === "development" ? { mockResetToken: token } : {}),
    };
  }

  async resetPassword(input: ResetPasswordInput, ip?: string, userAgent?: string) {
    const record = await passwordResetRepository.findValid(input.token);
    if (!record) {
      throw new UnauthorizedError("Token inválido ou expirado.", "INVALID_RESET_TOKEN");
    }

    const hashed = await bcrypt.hash(input.password, 12);
    await prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    });
    await passwordResetRepository.markUsed(record.id);
    await sessionRepository.revokeAllForUser(record.userId);
    await prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await auditService.log({
      userId: record.userId,
      action: "PASSWORD_RESET",
      entity: "User",
      entityId: record.userId,
      ip,
      userAgent,
    });

    return { message: "Senha redefinida com sucesso." };
  }

  async changePassword(userId: string, input: ChangePasswordInput, ip?: string, userAgent?: string) {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new UnauthorizedError("Usuário não encontrado.", "USER_NOT_FOUND");

    const valid = await bcrypt.compare(input.currentPassword, user.password);
    if (!valid) throw new UnauthorizedError("Senha atual incorreta.", "INVALID_PASSWORD");

    const hashed = await bcrypt.hash(input.newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    await auditService.log({
      userId,
      action: "PASSWORD_CHANGE",
      entity: "User",
      entityId: userId,
      ip,
      userAgent,
    });

    return { message: "Senha alterada com sucesso." };
  }

  async listSessions(userId: string, currentSessionId?: string): Promise<SessionInfo[]> {
    const sessions = await sessionRepository.findByUserId(userId);
    return sessions.map((s) => ({
      id: s.id,
      deviceName: s.deviceName,
      deviceType: s.deviceType,
      ip: s.ip,
      rememberMe: s.rememberMe,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
      current: s.id === currentSessionId,
    }));
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await sessionRepository.findById(sessionId);
    if (!session || session.userId !== userId) {
      throw new ForbiddenError("Sessão não encontrada.", "SESSION_NOT_FOUND");
    }
    await sessionRepository.revoke(sessionId);
    await prisma.refreshToken.updateMany({
      where: { sessionId },
      data: { revokedAt: new Date() },
    });
  }
}

export const authService = new AuthService();

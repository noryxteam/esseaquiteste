import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/database";
import { ForbiddenError, UnauthorizedError } from "@/shared/types/errors";
import { verifyAccessToken } from "@/modules/auth/utils/token.utils";
import type { AuthTokenPayload } from "@/modules/auth/types/auth.types";
import type { Permission } from "@/modules/auth/types/permissions";
import { hasAnyPermission, hasPermission } from "@/modules/auth/types/permissions";
import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

export function getRequestContext(req: Request) {
  return {
    userId: req.auth?.userId,
    sessionId: req.auth?.sessionId,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  };
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const started = performance.now();
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token de acesso não fornecido.", "TOKEN_MISSING");
    }

    const payload = verifyAccessToken(header.slice(7));
    const tUser = performance.now();
    const user = await prisma.user.findFirst({
      where: { id: payload.userId, deletedAt: null },
    });
    const userMs = performance.now() - tUser;

    if (!user || !user.ativo || user.status === "BLOCKED" || user.status === "INACTIVE") {
      throw new ForbiddenError("Conta indisponível.", "ACCOUNT_UNAVAILABLE");
    }

    const tSession = performance.now();
    const session = await prisma.session.findFirst({
      where: { id: payload.sessionId, revokedAt: null, expiresAt: { gt: new Date() } },
    });
    const sessionMs = performance.now() - tSession;

    if (!session) {
      throw new UnauthorizedError("Sessão inválida ou expirada.", "SESSION_EXPIRED");
    }

    req.auth = payload;
    const total = performance.now() - started;
    if (total > 200) {
      console.info(
        `[perf] authMiddleware ${Math.round(total)}ms (user=${Math.round(userMs)} session=${Math.round(sessionMs)}) ${req.method} ${req.path}`
      );
    }
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      next(error);
      return;
    }
    next(new UnauthorizedError("Token inválido ou expirado.", "TOKEN_INVALID"));
  }
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }
    if (!roles.includes(req.auth.role)) {
      next(new ForbiddenError("Acesso negado para este perfil.", "FORBIDDEN_ROLE"));
      return;
    }
    next();
  };
}

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }
    if (!hasPermission(req.auth.role, permission)) {
      next(new ForbiddenError("Permissão insuficiente.", "FORBIDDEN_PERMISSION"));
      return;
    }
    next();
  };
}

export function requireAnyPermission(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new UnauthorizedError());
      return;
    }
    if (!hasAnyPermission(req.auth.role, permissions)) {
      next(new ForbiddenError("Permissão insuficiente.", "FORBIDDEN_PERMISSION"));
      return;
    }
    next();
  };
}

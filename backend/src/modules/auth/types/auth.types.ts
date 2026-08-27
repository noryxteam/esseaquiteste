import type { DeviceType, UserRole, UserStatus, UserType } from "@prisma/client";
import type { Permission } from "@/modules/auth/types/permissions";

export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
  sessionId: string;
}

export interface DeviceInfo {
  deviceName?: string;
  deviceType: DeviceType;
  userAgent?: string;
  ip?: string;
}

export interface AuthUserProfile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  userType: UserType;
  status: UserStatus;
  cargo: string | null;
  empresa: string;
  avatar: string | null;
  ativo: boolean;
  permissions: Permission[];
  mfaEnabled: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResult extends AuthTokens {
  user: AuthUserProfile;
  sessionId: string;
}

export interface SessionInfo {
  id: string;
  deviceName: string | null;
  deviceType: DeviceType;
  ip: string | null;
  rememberMe: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  current: boolean;
}

/** Preparado para OAuth / SSO / MFA futuros */
export interface AuthProviderConfig {
  google: { enabled: boolean };
  microsoft: { enabled: boolean };
  magicLink: { enabled: boolean };
  passkeys: { enabled: boolean };
  mfa: { enabled: boolean };
}

export const AUTH_PROVIDERS: AuthProviderConfig = {
  google: { enabled: false },
  microsoft: { enabled: false },
  magicLink: { enabled: false },
  passkeys: { enabled: false },
  mfa: { enabled: false },
};

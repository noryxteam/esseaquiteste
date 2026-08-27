export type UserRole =
  | "ADMINISTRADOR"
  | "DESIGNER"
  | "DESENVOLVEDOR"
  | "FINANCEIRO"
  | "COMERCIAL"
  | "CLIENTE";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";

export type UserType = "ADMINISTRATOR" | "EMPLOYEE" | "CLIENT" | "PARTNER";

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "sign"
  | "manage"
  | "admin";

export type PermissionModule =
  | "dashboard"
  | "clients"
  | "projects"
  | "contracts"
  | "meetings"
  | "briefings"
  | "finance"
  | "tasks"
  | "files"
  | "reports"
  | "users"
  | "settings"
  | "audit"
  | "security";

export type Permission = `${PermissionModule}:${PermissionAction}`;

export interface AuthUser {
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
  sessionId: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "session_expired"
  | "blocked"
  | "forbidden";

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMINISTRADOR: "Administrador",
  DESIGNER: "Designer",
  DESENVOLVEDOR: "Desenvolvedor",
  FINANCEIRO: "Financeiro",
  COMERCIAL: "Comercial",
  CLIENTE: "Cliente",
};

export const ADMIN_ROLES: UserRole[] = ["ADMINISTRADOR"];
export const CLIENT_ROLES: UserRole[] = ["CLIENTE"];
export const STAFF_ROLES: UserRole[] = [
  "ADMINISTRADOR",
  "DESIGNER",
  "DESENVOLVEDOR",
  "FINANCEIRO",
  "COMERCIAL",
];

/** Preparado para OAuth / SSO / MFA futuros */
export const FUTURE_AUTH_PROVIDERS = {
  google: false,
  microsoft: false,
  magicLink: false,
  passkeys: false,
  mfa: false,
} as const;

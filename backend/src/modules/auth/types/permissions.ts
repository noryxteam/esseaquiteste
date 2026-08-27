import type { UserRole } from "@prisma/client";

export const PermissionAction = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  EXPORT: "export",
  SIGN: "sign",
  MANAGE: "manage",
  ADMIN: "admin",
} as const;

export type PermissionAction = (typeof PermissionAction)[keyof typeof PermissionAction];

export const PermissionModule = {
  DASHBOARD: "dashboard",
  CLIENTS: "clients",
  PROJECTS: "projects",
  CONTRACTS: "contracts",
  MEETINGS: "meetings",
  BRIEFINGS: "briefings",
  FINANCE: "finance",
  TASKS: "tasks",
  FILES: "files",
  REPORTS: "reports",
  USERS: "users",
  SETTINGS: "settings",
  AUDIT: "audit",
  SECURITY: "security",
} as const;

export type PermissionModule = (typeof PermissionModule)[keyof typeof PermissionModule];

export type Permission = `${PermissionModule}:${PermissionAction}`;

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMINISTRADOR: "Administrador",
  DESIGNER: "Designer",
  DESENVOLVEDOR: "Desenvolvedor",
  FINANCEIRO: "Financeiro",
  COMERCIAL: "Comercial",
  CLIENTE: "Cliente",
};

const allModules = Object.values(PermissionModule);
const allActions = Object.values(PermissionAction);

function modulePermissions(
  mod: PermissionModule,
  actions: PermissionAction[]
): Permission[] {
  return actions.map((action) => `${mod}:${action}` as Permission);
}

const staffBase: Permission[] = [
  ...modulePermissions(PermissionModule.DASHBOARD, [PermissionAction.VIEW]),
  ...modulePermissions(PermissionModule.CLIENTS, [PermissionAction.VIEW]),
  ...modulePermissions(PermissionModule.PROJECTS, [PermissionAction.VIEW]),
  ...modulePermissions(PermissionModule.MEETINGS, [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.EDIT]),
  ...modulePermissions(PermissionModule.TASKS, [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.EDIT]),
  ...modulePermissions(PermissionModule.FILES, [PermissionAction.VIEW, PermissionAction.CREATE]),
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMINISTRADOR: allModules.flatMap((mod) =>
    allActions.map((action) => `${mod}:${action}` as Permission)
  ),
  FINANCEIRO: [
    ...staffBase,
    ...modulePermissions(PermissionModule.FINANCE, [
      PermissionAction.VIEW,
      PermissionAction.CREATE,
      PermissionAction.EDIT,
      PermissionAction.EXPORT,
      PermissionAction.MANAGE,
    ]),
    ...modulePermissions(PermissionModule.CONTRACTS, [PermissionAction.VIEW, PermissionAction.EXPORT]),
    ...modulePermissions(PermissionModule.REPORTS, [PermissionAction.VIEW, PermissionAction.EXPORT]),
  ],
  COMERCIAL: [
    ...staffBase,
    ...modulePermissions(PermissionModule.CLIENTS, [PermissionAction.CREATE, PermissionAction.EDIT]),
    ...modulePermissions(PermissionModule.PROJECTS, [PermissionAction.CREATE, PermissionAction.EDIT]),
    ...modulePermissions(PermissionModule.CONTRACTS, [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.EDIT, PermissionAction.SIGN]),
    ...modulePermissions(PermissionModule.SECURITY, [PermissionAction.VIEW, PermissionAction.MANAGE]),
    ...modulePermissions(PermissionModule.BRIEFINGS, [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.EDIT]),
    ...modulePermissions(PermissionModule.REPORTS, [PermissionAction.VIEW]),
  ],
  DESIGNER: [
    ...staffBase,
    ...modulePermissions(PermissionModule.PROJECTS, [PermissionAction.EDIT]),
    ...modulePermissions(PermissionModule.BRIEFINGS, [PermissionAction.VIEW, PermissionAction.EDIT]),
    ...modulePermissions(PermissionModule.FILES, [PermissionAction.EDIT]),
  ],
  DESENVOLVEDOR: [
    ...staffBase,
    ...modulePermissions(PermissionModule.PROJECTS, [PermissionAction.EDIT]),
    ...modulePermissions(PermissionModule.BRIEFINGS, [PermissionAction.VIEW]),
    ...modulePermissions(PermissionModule.FILES, [PermissionAction.EDIT]),
  ],
  CLIENTE: [
    ...modulePermissions(PermissionModule.DASHBOARD, [PermissionAction.VIEW]),
    ...modulePermissions(PermissionModule.PROJECTS, [PermissionAction.VIEW]),
    ...modulePermissions(PermissionModule.CONTRACTS, [PermissionAction.VIEW, PermissionAction.SIGN]),
    ...modulePermissions(PermissionModule.MEETINGS, [PermissionAction.VIEW]),
    ...modulePermissions(PermissionModule.FILES, [PermissionAction.VIEW]),
  ],
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  const userPerms = getPermissionsForRole(role);
  return permissions.some((p) => userPerms.includes(p));
}

export const ADMIN_ROLES: UserRole[] = ["ADMINISTRADOR"];
export const CLIENT_ROLES: UserRole[] = ["CLIENTE"];
export const STAFF_ROLES: UserRole[] = [
  "ADMINISTRADOR",
  "DESIGNER",
  "DESENVOLVEDOR",
  "FINANCEIRO",
  "COMERCIAL",
];

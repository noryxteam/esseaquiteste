import type { Permission, UserRole } from "@/modules/auth/types/auth.types";
import { ADMIN_ROLES, CLIENT_ROLES, STAFF_ROLES } from "@/modules/auth/types/auth.types";

export function hasPermission(
  permissions: Permission[] | undefined,
  permission: Permission
): boolean {
  return permissions?.includes(permission) ?? false;
}

export function hasAnyPermission(
  permissions: Permission[] | undefined,
  required: Permission[]
): boolean {
  return required.some((p) => permissions?.includes(p));
}

export function isAdmin(role: UserRole | undefined): boolean {
  return role ? ADMIN_ROLES.includes(role) : false;
}

export function isClient(role: UserRole | undefined): boolean {
  return role ? CLIENT_ROLES.includes(role) : false;
}

export function isStaff(role: UserRole | undefined): boolean {
  return role ? STAFF_ROLES.includes(role) : false;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

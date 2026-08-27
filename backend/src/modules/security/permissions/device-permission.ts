import { DevicePermission } from "@prisma/client";
import { ForbiddenError } from "@/shared/types/errors";

/** Reexporta o enum do Prisma — única fonte de verdade no backend. */
export { DevicePermission };

export const DEVICE_PERMISSION_LABELS: Record<DevicePermission, string> = {
  VIEWER: "Visualizador",
  SIGNER: "Assinante",
};

export function isDevicePermission(value: unknown): value is DevicePermission {
  return value === DevicePermission.VIEWER || value === DevicePermission.SIGNER;
}

export function canViewContract(permission: DevicePermission | null | undefined): boolean {
  return (
    permission === DevicePermission.VIEWER || permission === DevicePermission.SIGNER
  );
}

export function canDownloadPdf(permission: DevicePermission | null | undefined): boolean {
  return canViewContract(permission);
}

export function canSignContract(permission: DevicePermission | null | undefined): boolean {
  return permission === DevicePermission.SIGNER;
}

/** Garante permissão de assinatura — use em toda ação crítica de assinatura. */
export function assertCanSign(permission: DevicePermission | null | undefined): void {
  if (!canSignContract(permission)) {
    throw new ForbiddenError(
      "Este dispositivo não tem permissão para assinar o contrato.",
      "DEVICE_PERMISSION_DENIED"
    );
  }
}

export type AccessCodeStatus = "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED";
export type DeviceStatus = "ACTIVE" | "REVOKED";
export type CodeValidity = "30m" | "1h" | "6h" | "24h" | "custom";

/** Única fonte de verdade no frontend — espelha o enum Prisma DevicePermission. */
export const DevicePermission = {
  VIEWER: "VIEWER",
  SIGNER: "SIGNER",
} as const;

export type DevicePermission = (typeof DevicePermission)[keyof typeof DevicePermission];

export const DEVICE_PERMISSION_LABELS: Record<DevicePermission, string> = {
  VIEWER: "Visualizador",
  SIGNER: "Assinante",
};

export function canSignWithPermission(permission?: DevicePermission | null): boolean {
  return permission === DevicePermission.SIGNER;
}

export interface ContractSecurityOverview {
  clientName: string;
  companyName: string;
  contractNumber: string;
  status: string;
  authorizedDevicesCount: number;
  activeCodesCount: number;
  pendingRequestsCount?: number;
  lastAccessAt: string | null;
}

export interface AuthorizedDevice {
  id: string;
  label: string;
  os: string;
  browser: string;
  deviceType: string;
  deviceTypeRaw: string;
  firstAccess: string;
  lastAccess: string;
  /** Quando o acesso foi liberado */
  authorizedAt?: string;
  fingerprint?: string;
  ip: string;
  status: string;
  statusRaw: DeviceStatus;
  sessionOnly: boolean;
  permission: DevicePermission;
  permissionLabel: string;
}

export interface AuthorizationHistoryEntry {
  id: string;
  label: string;
  os: string;
  browser: string;
  fingerprint?: string;
  status: string;
  permission: string | null;
  permissionLabel: string | null;
  notifiedEmail: string | null;
  /** Quando pediu acesso */
  createdAt: string;
  /** Quando foi aprovado / entrou */
  decidedAt: string | null;
}

export interface AccessCode {
  id: string;
  codeHint: string;
  createdAt: string;
  expiresAt: string;
  createdBy: string;
  status: string;
  statusRaw: AccessCodeStatus;
  source: string;
  permission?: DevicePermission | null;
  permissionLabel?: string | null;
  active?: boolean;
}

export interface GeneratedAccessCode extends AccessCode {
  code: string;
}

export interface PendingDeviceRequest {
  id: string;
  label: string;
  os: string;
  browser: string;
  status: string;
  notifiedEmail: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface SecurityTimelineEvent {
  id: string;
  type: string;
  typeLabel: string;
  description: string;
  date: string;
  user: string;
  device: string | null;
}

export interface PortalAccessStatus {
  authorized: boolean;
  requiresCode: boolean;
  pendingApproval?: boolean;
  requestId?: string;
  requestStatus?: string;
  trustedDevice?: boolean;
  trustedNoraxDevice?: boolean;
  deviceLabel?: string;
  contractId?: string;
  slug?: string;
  contractNumber?: string;
  clientName?: string;
  portalToken?: string;
  permission?: DevicePermission;
  canSign?: boolean;
  canDownloadPdf?: boolean;
}

export interface PortalContractMeta {
  id: string;
  slug: string;
  number: string;
  title: string;
  status: string;
  clientName: string;
  companyName: string;
  /** Contrato avulso da aba Apaga Logo — acesso aberto, sem gate de dispositivo. */
  isApagaLogo?: boolean;
}

export interface PortalSessionResult {
  portalToken: string;
  sessionType: "TRUSTED_DEVICE" | "SESSION_ONLY";
  expiresAt: string;
  trustedDevice: boolean;
  permission?: DevicePermission;
  canSign?: boolean;
}

export interface DeviceAuthorizationPanel {
  requestId: string;
  status: string;
  contractId: string;
  contractNumber: string;
  contractTitle: string;
  clientName: string;
  companyName: string;
  device: {
    label: string;
    os: string;
    browser: string;
    deviceType: string;
    ip: string;
  };
  requestedAt: string;
  expiresAt: string;
  canDecide: boolean;
  grantedPermission: DevicePermission | null;
  permissions: Array<{ id: DevicePermission; label: string; description: string }>;
}

export interface TrustedDevice {
  id: string;
  label: string;
  os: string;
  browser: string;
  deviceType: string;
  firstAccess: string;
  lastAccess: string;
  ip: string;
  status: string;
  statusRaw: DeviceStatus;
}

export interface ClientDevice {
  id: string;
  label: string;
  deviceType: string;
  lastAccess: string;
  isCurrent: boolean;
}

import { prisma } from "@/database";
import type {
  AccessCodeSource,
  AccessCodeStatus,
  AuthorizedDeviceStatus,
  SecurityEventType,
} from "@prisma/client";

const contractInclude = {
  cliente: {
    select: {
      id: true,
      nome: true,
      empresa: true,
      email: true,
      telefone: true,
      cidade: true,
      estado: true,
      setupData: true,
    },
  },
  projeto: { select: { id: true, nome: true } },
  signatures: true,
};

export class ContractSecurityRepository {
  async findContractById(id: string) {
    return prisma.contract.findFirst({
      where: {
        deletedAt: null,
        OR: [{ id }, { uniqueSlug: id }, { numeroContrato: id }],
      },
      include: contractInclude,
    });
  }

  async findContractBySlug(slug: string) {
    return prisma.contract.findFirst({
      where: {
        deletedAt: null,
        OR: [{ uniqueSlug: slug }, { id: slug }, { numeroContrato: slug }],
      },
      include: contractInclude,
    });
  }

  async getOverview(contractId: string) {
    const [devices, activeCodes, lastEvent] = await Promise.all([
      prisma.contractAuthorizedDevice.count({
        where: { contractId, status: "ACTIVE", sessionOnly: false },
      }),
      prisma.contractAccessCode.count({
        where: { contractId, status: "ACTIVE", expiresAt: { gt: new Date() } },
      }),
      prisma.contractSecurityEvent.findFirst({
        where: { contractId, eventType: "LAST_ACCESS" },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { authorizedDevices: devices, activeCodes, lastAccessAt: lastEvent?.createdAt ?? null };
  }

  async listDevices(contractId: string) {
    return prisma.contractAuthorizedDevice.findMany({
      where: { contractId },
      orderBy: { ultimoAcesso: "desc" },
    });
  }

  async findDevice(contractId: string, deviceId: string) {
    return prisma.contractAuthorizedDevice.findFirst({
      where: { id: deviceId, contractId },
    });
  }

  async findDeviceByFingerprint(contractId: string, fingerprint: string) {
    return prisma.contractAuthorizedDevice.findFirst({
      where: { contractId, fingerprint },
    });
  }

  /**
   * Autorização compartilhada: dispositivo ACTIVE em qualquer contrato do mesmo cliente.
   */
  async findActiveDeviceForCliente(clienteId: string, fingerprint: string) {
    return prisma.contractAuthorizedDevice.findFirst({
      where: {
        fingerprint,
        status: "ACTIVE",
        sessionOnly: false,
        contract: { clienteId, deletedAt: null },
      },
      orderBy: { ultimoAcesso: "desc" },
    });
  }

  /** Lista unificada de dispositivos do cliente (todos os contratos). */
  async listDevicesForCliente(clienteId: string) {
    return prisma.contractAuthorizedDevice.findMany({
      where: {
        contract: { clienteId, deletedAt: null },
      },
      orderBy: { ultimoAcesso: "desc" },
    });
  }

  async createDevice(data: {
    contractId: string;
    fingerprint: string;
    label: string;
    os?: string;
    browser?: string;
    deviceType: import("@prisma/client").DeviceType;
    ip?: string;
    sessionOnly?: boolean;
    aprovadoPor?: string;
    permission: import("@prisma/client").DevicePermission;
  }) {
    return prisma.contractAuthorizedDevice.create({ data });
  }

  async updateDevice(
    deviceId: string,
    data: Partial<{
      label: string;
      ultimoAcesso: Date;
      status: AuthorizedDeviceStatus;
      revokedAt: Date | null;
      ip: string;
      sessionOnly: boolean;
      os: string;
      browser: string;
      permission: import("@prisma/client").DevicePermission;
    }>
  ) {
    return prisma.contractAuthorizedDevice.update({ where: { id: deviceId }, data });
  }

  async revokePortalSessions(contractId: string, fingerprint: string) {
    return prisma.contractPortalSession.updateMany({
      where: { contractId, fingerprint, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllPortalSessionsByFingerprint(fingerprint: string) {
    return prisma.contractPortalSession.updateMany({
      where: { fingerprint, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async listAccessCodes(contractId: string) {
    return prisma.contractAccessCode.findMany({
      where: { contractId },
      include: { createdBy: { select: { id: true, nome: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async createAccessCode(data: {
    contractId: string;
    codeHash: string;
    codeHint: string;
    expiresAt: Date;
    createdById?: string;
    source: AccessCodeSource;
    permission?: import("@prisma/client").DevicePermission | null;
    fingerprintBound?: string | null;
    accessRequestId?: string | null;
    active?: boolean;
  }) {
    return prisma.contractAccessCode.create({
      data: {
        ...data,
        active: data.active ?? true,
      },
      include: { createdBy: { select: { id: true, nome: true } } },
    });
  }

  async findActiveCodeByHash(contractId: string, codeHash: string) {
    return prisma.contractAccessCode.findFirst({
      where: {
        contractId,
        codeHash,
        status: "ACTIVE",
        active: true,
        expiresAt: { gt: new Date() },
      },
    });
  }

  /** Código de autorização do cliente (com permissão) — pode estar em qualquer contrato via hash único operacional. */
  async findActivePermissionCodeByHash(codeHash: string) {
    return prisma.contractAccessCode.findFirst({
      where: {
        codeHash,
        status: "ACTIVE",
        active: true,
        source: "CLIENT_AUTHORIZED",
        expiresAt: { gt: new Date() },
      },
    });
  }

  async updateAccessCode(
    id: string,
    data: Partial<{
      status: AccessCodeStatus;
      usedAt: Date;
      cancelledAt: Date;
      active: boolean;
    }>
  ) {
    return prisma.contractAccessCode.update({ where: { id }, data });
  }

  async expireStaleCodes(contractId: string) {
    const now = new Date();
    const expired = await prisma.contractAccessCode.findMany({
      where: { contractId, status: "ACTIVE", expiresAt: { lte: now } },
    });
    if (expired.length === 0) return [];
    await prisma.contractAccessCode.updateMany({
      where: { contractId, status: "ACTIVE", expiresAt: { lte: now } },
      data: { status: "EXPIRED", active: false },
    });
    return expired;
  }

  async createSecurityEvent(data: {
    contractId: string;
    eventType: SecurityEventType;
    description: string;
    userId?: string;
    deviceId?: string;
    metadata?: object;
    ip?: string;
    userAgent?: string;
  }) {
    return prisma.contractSecurityEvent.create({ data });
  }

  async listSecurityEvents(contractId: string, limit = 100) {
    return prisma.contractSecurityEvent.findMany({
      where: { contractId },
      include: {
        user: { select: { id: true, nome: true } },
        device: { select: { id: true, label: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async createPortalSession(data: {
    contractId: string;
    fingerprint: string;
    token: string;
    sessionType: import("@prisma/client").PortalSessionType;
    expiresAt: Date;
    deviceId?: string;
  }) {
    return prisma.contractPortalSession.create({ data });
  }

  async findValidPortalSession(contractId: string, token: string, fingerprint: string) {
    return prisma.contractPortalSession.findFirst({
      where: {
        contractId,
        token,
        fingerprint,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { device: true },
    });
  }

  async findActivePortalSessionByFingerprint(contractId: string, fingerprint: string) {
    return prisma.contractPortalSession.findFirst({
      where: {
        contractId,
        fingerprint,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActiveAt: "desc" },
    });
  }

  async touchPortalSession(id: string) {
    return prisma.contractPortalSession.update({
      where: { id },
      data: { lastActiveAt: new Date() },
    });
  }

  async countActiveDevices(contractId: string) {
    return prisma.contractAuthorizedDevice.count({
      where: { contractId, status: "ACTIVE" },
    });
  }

  async expireStaleAccessRequests(contractId: string) {
    await prisma.contractDeviceAccessRequest.updateMany({
      where: { contractId, status: "PENDING", expiresAt: { lte: new Date() } },
      data: { status: "EXPIRED", decidedAt: new Date() },
    });
  }

  async cancelPendingAccessRequests(contractId: string, fingerprint: string) {
    await prisma.contractDeviceAccessRequest.updateMany({
      where: { contractId, fingerprint, status: "PENDING" },
      data: { status: "EXPIRED", decidedAt: new Date() },
    });
  }

  async createAccessRequest(data: {
    contractId: string;
    codeId?: string;
    fingerprint: string;
    label: string;
    os?: string;
    browser?: string;
    deviceType: import("@prisma/client").DeviceType;
    ip?: string;
    userAgent?: string;
    approveToken: string;
    denyToken: string;
    notifiedEmail?: string;
    expiresAt: Date;
  }) {
    return prisma.contractDeviceAccessRequest.create({ data });
  }

  async findAccessRequestById(id: string) {
    return prisma.contractDeviceAccessRequest.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            cliente: { select: { id: true, nome: true, email: true, setupData: true } },
          },
        },
      },
    });
  }

  async findPendingAccessRequest(contractId: string, fingerprint: string) {
    return prisma.contractDeviceAccessRequest.findFirst({
      where: {
        contractId,
        fingerprint,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAccessRequestByDecisionToken(token: string) {
    return prisma.contractDeviceAccessRequest.findFirst({
      where: {
        OR: [{ approveToken: token }, { denyToken: token }],
      },
      include: {
        contract: {
          include: {
            cliente: { select: { id: true, nome: true, email: true, setupData: true } },
          },
        },
      },
    });
  }

  async updateAccessRequest(
    id: string,
    data: Partial<{
      status: import("@prisma/client").DeviceAccessRequestStatus;
      decidedAt: Date;
      grantedPermission: import("@prisma/client").DevicePermission | null;
      issuedCodeId: string | null;
      deliveryCode: string | null;
    }>
  ) {
    return prisma.contractDeviceAccessRequest.update({ where: { id }, data });
  }

  async listPendingAccessRequests(contractId: string) {
    return prisma.contractDeviceAccessRequest.findMany({
      where: { contractId, status: "PENDING", expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }

  async listAccessRequests(contractId: string, limit = 100) {
    return prisma.contractDeviceAccessRequest.findMany({
      where: { contractId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async findAccessRequestByApproveToken(token: string) {
    return prisma.contractDeviceAccessRequest.findFirst({
      where: { approveToken: token },
      include: {
        contract: {
          include: {
            cliente: { select: { id: true, nome: true, email: true, empresa: true, setupData: true } },
          },
        },
      },
    });
  }
}

export const contractSecurityRepository = new ContractSecurityRepository();

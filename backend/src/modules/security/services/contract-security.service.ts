import { ValidationError, NotFoundError } from "@/shared/types/errors";
import { contractSecurityRepository } from "@/modules/security/repositories/contract-security.repository";
import {
  generateAccessCode,
  getCodeHint,
  hashAccessCode,
} from "@/modules/security/utils/access-code.utils";
import { emailService } from "@/modules/security/services/email.service";
import { DEVICE_PERMISSION_LABELS } from "@/modules/security/permissions/device-permission";
import type { RequestContext } from "@/shared/types/api";
import type { DevicePermission } from "@prisma/client";

const VALIDITY_MINUTES: Record<string, number> = {
  "30m": 30,
  "1h": 60,
  "6h": 360,
  "24h": 1440,
};

function formatDateBR(date: Date): string {
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function mapDeviceType(type: string): string {
  const labels: Record<string, string> = {
    DESKTOP: "Desktop",
    NOTEBOOK: "Notebook",
    MOBILE: "Celular",
    TABLET: "Tablet",
    UNKNOWN: "Desconhecido",
  };
  return labels[type] ?? type;
}

function mapCodeStatus(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Ativo",
    USED: "Utilizado",
    EXPIRED: "Expirado",
    CANCELLED: "Cancelado",
  };
  return labels[status] ?? status;
}

function mapDeviceStatus(status: string): string {
  return status === "ACTIVE" ? "Ativo" : "Revogado";
}

export class ContractSecurityService {
  async getOverview(contractId: string) {
    const contract = await contractSecurityRepository.findContractById(contractId);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    await contractSecurityRepository.expireStaleCodes(contractId);
    await contractSecurityRepository.expireStaleAccessRequests(contractId);
    const stats = await contractSecurityRepository.getOverview(contractId);
    const pending = await contractSecurityRepository.listPendingAccessRequests(contractId);

    return {
      clientName: contract.cliente.nome,
      companyName: contract.cliente.empresa,
      contractNumber: contract.numeroContrato,
      status: contract.status,
      authorizedDevicesCount: stats.authorizedDevices,
      activeCodesCount: stats.activeCodes,
      pendingRequestsCount: pending.length,
      lastAccessAt: stats.lastAccessAt ? formatDateBR(stats.lastAccessAt) : null,
    };
  }

  async listDevices(contractId: string) {
    const contract = await this.ensureContract(contractId);
    const devices = await contractSecurityRepository.listDevicesForCliente(contract.clienteId);
    // Uma lista por cliente: deduplica fingerprint (mantém o mais recente)
    const byFp = new Map<string, (typeof devices)[number]>();
    for (const d of devices) {
      if (!byFp.has(d.fingerprint)) byFp.set(d.fingerprint, d);
    }
    return [...byFp.values()].map((d) => ({
      id: d.id,
      label: d.label,
      os: d.os ?? "—",
      browser: d.browser ?? "—",
      deviceType: mapDeviceType(d.deviceType),
      deviceTypeRaw: d.deviceType,
      firstAccess: formatDateBR(d.primeiroAcesso),
      lastAccess: formatDateBR(d.ultimoAcesso),
      authorizedAt: formatDateBR(d.autorizadoEm),
      fingerprint: d.fingerprint,
      ip: d.ip ?? "—",
      status: mapDeviceStatus(d.status),
      statusRaw: d.status,
      sessionOnly: d.sessionOnly,
      permission: d.permission as DevicePermission,
      permissionLabel: DEVICE_PERMISSION_LABELS[d.permission as DevicePermission] ?? d.permission,
    }));
  }

  async getDeviceDetails(contractId: string, deviceId: string) {
    const device = await contractSecurityRepository.findDevice(contractId, deviceId);
    if (!device) throw new NotFoundError("Dispositivo não encontrado.", "DEVICE_NOT_FOUND");
    return {
      id: device.id,
      label: device.label,
      os: device.os ?? "—",
      browser: device.browser ?? "—",
      deviceType: mapDeviceType(device.deviceType),
      firstAccess: formatDateBR(device.primeiroAcesso),
      lastAccess: formatDateBR(device.ultimoAcesso),
      authorizedAt: formatDateBR(device.autorizadoEm),
      ip: device.ip ?? "—",
      status: mapDeviceStatus(device.status),
      sessionOnly: device.sessionOnly,
      approvedBy: device.aprovadoPor ?? "—",
      permission: device.permission,
      permissionLabel: DEVICE_PERMISSION_LABELS[device.permission] ?? device.permission,
    };
  }

  async renameDevice(contractId: string, deviceId: string, label: string, ctx: RequestContext) {
    const device = await contractSecurityRepository.findDevice(contractId, deviceId);
    if (!device) throw new NotFoundError("Dispositivo não encontrado.", "DEVICE_NOT_FOUND");

    const updated = await contractSecurityRepository.updateDevice(deviceId, { label });
    await contractSecurityRepository.createSecurityEvent({
      contractId,
      eventType: "DEVICE_RENAMED",
      description: `Dispositivo renomeado para "${label}"`,
      userId: ctx.userId,
      deviceId,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      metadata: { previousLabel: device.label },
    });

    return { id: updated.id, label: updated.label };
  }

  async revokeDevice(contractId: string, deviceId: string, ctx: RequestContext) {
    const device = await contractSecurityRepository.findDevice(contractId, deviceId);
    if (!device) throw new NotFoundError("Dispositivo não encontrado.", "DEVICE_NOT_FOUND");
    if (device.status === "REVOKED") {
      throw new ValidationError("Dispositivo já revogado.", "DEVICE_ALREADY_REVOKED");
    }

    await contractSecurityRepository.updateDevice(deviceId, {
      status: "REVOKED",
      revokedAt: new Date(),
    });
    await contractSecurityRepository.revokePortalSessions(contractId, device.fingerprint);

    await contractSecurityRepository.createSecurityEvent({
      contractId,
      eventType: "DEVICE_REVOKED",
      description: `Acesso revogado: ${device.label}`,
      userId: ctx.userId,
      deviceId,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });

    return { success: true };
  }

  async generateAccessCode(
    contractId: string,
    validity: string,
    customMinutes: number | undefined,
    ctx: RequestContext
  ) {
    const contract = await this.ensureContract(contractId);
    const minutes =
      validity === "custom"
        ? customMinutes
        : VALIDITY_MINUTES[validity];

    if (!minutes || minutes < 5 || minutes > 10080) {
      throw new ValidationError("Validade inválida.", "INVALID_VALIDITY");
    }

    const plainCode = generateAccessCode();
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    const record = await contractSecurityRepository.createAccessCode({
      contractId,
      codeHash: hashAccessCode(plainCode),
      codeHint: getCodeHint(plainCode),
      expiresAt,
      createdById: ctx.userId,
      source: "STAFF_GENERATED",
    });

    await contractSecurityRepository.createSecurityEvent({
      contractId,
      eventType: "CODE_CREATED",
      description: `Código de acesso gerado (validade ${minutes} min)`,
      userId: ctx.userId,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      metadata: { codeId: record.id, expiresAt: expiresAt.toISOString() },
    });

    return {
      id: record.id,
      code: plainCode,
      createdAt: formatDateBR(record.createdAt),
      expiresAt: formatDateBR(expiresAt),
      createdBy: record.createdBy?.nome ?? "Sistema",
      status: mapCodeStatus(record.status),
      statusRaw: record.status,
    };
  }

  async listAccessCodes(contractId: string) {
    await this.ensureContract(contractId);
    await contractSecurityRepository.expireStaleCodes(contractId);
    const codes = await contractSecurityRepository.listAccessCodes(contractId);

    return codes.map((c) => ({
      id: c.id,
      codeHint: `NXR-****-${c.codeHint}`,
      createdAt: formatDateBR(c.createdAt),
      expiresAt: formatDateBR(c.expiresAt),
      createdBy:
        c.createdBy?.nome ??
        (c.source === "CLIENT_AUTHORIZED"
          ? "Cliente (autorização)"
          : c.source === "CLIENT_REQUESTED"
            ? "Cliente"
            : "Sistema"),
      status: mapCodeStatus(c.status),
      statusRaw: c.status,
      source: c.source,
      active: c.active,
      permission: c.permission,
      permissionLabel: c.permission
        ? DEVICE_PERMISSION_LABELS[c.permission as DevicePermission]
        : null,
    }));
  }

  async listPendingRequests(contractId: string) {
    await this.ensureContract(contractId);
    await contractSecurityRepository.expireStaleAccessRequests(contractId);
    const rows = await contractSecurityRepository.listPendingAccessRequests(contractId);
    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      os: r.os ?? "—",
      browser: r.browser ?? "—",
      status: r.status,
      notifiedEmail: r.notifiedEmail,
      createdAt: formatDateBR(r.createdAt),
      expiresAt: formatDateBR(r.expiresAt),
    }));
  }

  async listAuthorizationHistory(contractId: string) {
    await this.ensureContract(contractId);
    const rows = await contractSecurityRepository.listAccessRequests(contractId);
    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      os: r.os ?? "—",
      browser: r.browser ?? "—",
      fingerprint: r.fingerprint,
      status: r.status,
      permission: r.grantedPermission,
      permissionLabel: r.grantedPermission
        ? DEVICE_PERMISSION_LABELS[r.grantedPermission]
        : null,
      notifiedEmail: r.notifiedEmail,
      createdAt: formatDateBR(r.createdAt),
      decidedAt: r.decidedAt ? formatDateBR(r.decidedAt) : null,
    }));
  }

  async cancelAccessCode(contractId: string, codeId: string, ctx: RequestContext) {
    const codes = await contractSecurityRepository.listAccessCodes(contractId);
    const code = codes.find((c) => c.id === codeId);
    if (!code) throw new NotFoundError("Código não encontrado.", "CODE_NOT_FOUND");
    if (code.status !== "ACTIVE") {
      throw new ValidationError("Código não pode ser cancelado.", "CODE_NOT_ACTIVE");
    }

    await contractSecurityRepository.updateAccessCode(codeId, {
      status: "CANCELLED",
      cancelledAt: new Date(),
      active: false,
    });

    await contractSecurityRepository.createSecurityEvent({
      contractId,
      eventType: "CODE_CANCELLED",
      description: `Código cancelado (hint: ${code.codeHint})`,
      userId: ctx.userId,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      metadata: { codeId },
    });

    return { success: true };
  }

  async getTimeline(contractId: string) {
    await this.ensureContract(contractId);
    const events = await contractSecurityRepository.listSecurityEvents(contractId);

    const eventLabels: Record<string, string> = {
      CODE_CREATED: "Código criado",
      CODE_USED: "Código utilizado",
      CODE_EXPIRED: "Código expirado",
      CODE_CANCELLED: "Código cancelado",
      DEVICE_AUTHORIZED: "Dispositivo autorizado",
      DEVICE_REVOKED: "Dispositivo removido",
      DEVICE_RENAMED: "Nome do dispositivo alterado",
      FIRST_ACCESS: "Primeiro acesso",
      LAST_ACCESS: "Último acesso",
    };

    return events.map((e) => ({
      id: e.id,
      type: e.eventType,
      typeLabel: eventLabels[e.eventType] ?? e.eventType,
      description: e.description,
      date: formatDateBR(e.createdAt),
      user: e.user?.nome ?? "Sistema",
      device: e.device?.label ?? null,
    }));
  }

  private async ensureContract(contractId: string) {
    const contract = await contractSecurityRepository.findContractById(contractId);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");
    return contract;
  }

  async requestClientDeviceCode(contractId: string) {
    const contract = await this.ensureContract(contractId);
    const plainCode = generateAccessCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await contractSecurityRepository.createAccessCode({
      contractId,
      codeHash: hashAccessCode(plainCode),
      codeHint: getCodeHint(plainCode),
      expiresAt,
      source: "CLIENT_REQUESTED",
    });

    await emailService.sendAccessCodeEmail({
      to: contract.cliente.email,
      clientName: contract.cliente.nome,
      contractNumber: contract.numeroContrato,
      code: plainCode,
      expiresAt,
    });

    await contractSecurityRepository.createSecurityEvent({
      contractId,
      eventType: "CODE_CREATED",
      description: "Código solicitado pelo cliente via e-mail",
      metadata: { source: "CLIENT_REQUESTED" },
    });

    return {
      message: "Código enviado para o e-mail cadastrado.",
      expiresAt: formatDateBR(expiresAt),
      connectedDevices: await contractSecurityRepository.countActiveDevices(contractId),
    };
  }
}

export const contractSecurityService = new ContractSecurityService();

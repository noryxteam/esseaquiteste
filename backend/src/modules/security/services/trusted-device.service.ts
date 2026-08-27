import { ValidationError, NotFoundError } from "@/shared/types/errors";
import { trustedDeviceRepository } from "@/modules/security/repositories/trusted-device.repository";
import { contractSecurityRepository } from "@/modules/security/repositories/contract-security.repository";
import { resolveDeviceInfo } from "@/modules/security/utils/device-info.utils";
import type { RequestContext } from "@/shared/types/api";

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

function mapDevice(d: {
  id: string;
  label: string;
  os: string | null;
  browser: string | null;
  deviceType: string;
  primeiroAcesso: Date;
  ultimoAcesso: Date;
  ip: string | null;
  status: string;
}) {
  return {
    id: d.id,
    label: d.label,
    os: d.os ?? "—",
    browser: d.browser ?? "—",
    deviceType: mapDeviceType(d.deviceType),
    firstAccess: formatDateBR(d.primeiroAcesso),
    lastAccess: formatDateBR(d.ultimoAcesso),
    ip: d.ip ?? "—",
    status: d.status === "ACTIVE" ? "Ativo" : "Sem acesso",
    statusRaw: d.status as "ACTIVE" | "REVOKED",
  };
}

export class TrustedDeviceService {
  async list(userId: string) {
    const devices = await trustedDeviceRepository.listByUser(userId);
    return devices.map(mapDevice);
  }

  async register(
    userId: string,
    fingerprint: string,
    label: string | undefined,
    ctx: RequestContext
  ) {
    const existing = await trustedDeviceRepository.findAnyByUserAndFingerprint(
      userId,
      fingerprint
    );
    const info = resolveDeviceInfo(fingerprint, ctx.userAgent, ctx.ip, label);

    if (existing) {
      if (existing.status === "ACTIVE") {
        await trustedDeviceRepository.update(existing.id, {
          ultimoAcesso: new Date(),
          ip: ctx.ip,
          ...(label ? { label } : {}),
        });
        return {
          id: existing.id,
          label: label ?? existing.label,
          deviceType: mapDeviceType(existing.deviceType),
          status: "Ativo",
          reactivated: false,
        };
      }

      // Estava sem acesso — reativa em vez de criar duplicata
      const reactivated = await trustedDeviceRepository.update(existing.id, {
        status: "ACTIVE",
        revokedAt: null,
        ultimoAcesso: new Date(),
        label: label ?? existing.label,
        os: info.os,
        browser: info.browser,
        deviceType: info.deviceType,
        ip: ctx.ip,
      });

      return {
        id: reactivated.id,
        label: reactivated.label,
        deviceType: mapDeviceType(reactivated.deviceType),
        status: "Ativo",
        reactivated: true,
      };
    }

    const device = await trustedDeviceRepository.create({
      userId,
      fingerprint,
      label: info.label,
      os: info.os,
      browser: info.browser,
      deviceType: info.deviceType,
      ip: ctx.ip,
    });

    return {
      id: device.id,
      label: device.label,
      deviceType: mapDeviceType(device.deviceType),
      status: "Ativo",
      reactivated: false,
    };
  }

  async rename(userId: string, deviceId: string, label: string) {
    const device = await trustedDeviceRepository.findById(deviceId, userId);
    if (!device) throw new NotFoundError("Dispositivo não encontrado.", "DEVICE_NOT_FOUND");

    const updated = await trustedDeviceRepository.update(deviceId, { label });
    return { id: updated.id, label: updated.label };
  }

  /** Remove o acesso confiável, mas mantém o registro. */
  async revoke(userId: string, deviceId: string) {
    const device = await trustedDeviceRepository.findById(deviceId, userId);
    if (!device) throw new NotFoundError("Dispositivo não encontrado.", "DEVICE_NOT_FOUND");

    await trustedDeviceRepository.update(deviceId, {
      status: "REVOKED",
      revokedAt: new Date(),
    });
    await contractSecurityRepository.revokeAllPortalSessionsByFingerprint(device.fingerprint);

    return { success: true };
  }

  /** Apaga o dispositivo permanentemente do banco. */
  async remove(userId: string, deviceId: string) {
    const device = await trustedDeviceRepository.findById(deviceId, userId);
    if (!device) throw new NotFoundError("Dispositivo não encontrado.", "DEVICE_NOT_FOUND");

    await contractSecurityRepository.revokeAllPortalSessionsByFingerprint(device.fingerprint);
    await trustedDeviceRepository.remove(deviceId);

    return { success: true };
  }

  async restore(userId: string, deviceId: string) {
    const device = await trustedDeviceRepository.findById(deviceId, userId);
    if (!device) throw new NotFoundError("Dispositivo não encontrado.", "DEVICE_NOT_FOUND");
    if (device.status === "ACTIVE") {
      throw new ValidationError("Dispositivo já está com acesso.", "DEVICE_ALREADY_ACTIVE");
    }

    await trustedDeviceRepository.update(deviceId, {
      status: "ACTIVE",
      revokedAt: null,
      ultimoAcesso: new Date(),
    });

    return { success: true };
  }

  async check(userId: string, fingerprint: string) {
    const device = await trustedDeviceRepository.findByUserAndFingerprint(userId, fingerprint);
    if (device) {
      await trustedDeviceRepository.update(device.id, {
        ultimoAcesso: new Date(),
      });
    }
    return {
      trusted: Boolean(device),
      device: device
        ? { id: device.id, label: device.label, lastAccess: formatDateBR(device.ultimoAcesso) }
        : null,
    };
  }
}

export const trustedDeviceService = new TrustedDeviceService();

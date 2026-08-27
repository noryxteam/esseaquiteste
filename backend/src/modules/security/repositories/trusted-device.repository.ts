import { prisma } from "@/database";
import type { AuthorizedDeviceStatus, DeviceType } from "@prisma/client";

export class TrustedDeviceRepository {
  async listByUser(userId: string) {
    return prisma.noraxTrustedDevice.findMany({
      where: { userId },
      orderBy: { ultimoAcesso: "desc" },
    });
  }

  async findByUserAndFingerprint(userId: string, fingerprint: string) {
    return prisma.noraxTrustedDevice.findFirst({
      where: { userId, fingerprint, status: "ACTIVE" },
    });
  }

  /** Inclui dispositivos revogados (para reativação / unique constraint). */
  async findAnyByUserAndFingerprint(userId: string, fingerprint: string) {
    return prisma.noraxTrustedDevice.findFirst({
      where: { userId, fingerprint },
    });
  }

  async findActiveByFingerprint(fingerprint: string) {
    return prisma.noraxTrustedDevice.findFirst({
      where: { fingerprint, status: "ACTIVE" },
    });
  }

  async create(data: {
    userId: string;
    fingerprint: string;
    label: string;
    os?: string;
    browser?: string;
    deviceType: DeviceType;
    ip?: string;
  }) {
    return prisma.noraxTrustedDevice.create({ data });
  }

  async update(
    id: string,
    data: Partial<{
      label: string;
      ultimoAcesso: Date;
      status: AuthorizedDeviceStatus;
      revokedAt: Date | null;
      ip: string;
      os: string;
      browser: string;
      deviceType: DeviceType;
    }>
  ) {
    return prisma.noraxTrustedDevice.update({ where: { id }, data });
  }

  async findById(id: string, userId: string) {
    return prisma.noraxTrustedDevice.findFirst({ where: { id, userId } });
  }

  async remove(id: string) {
    return prisma.noraxTrustedDevice.delete({ where: { id } });
  }
}

export const trustedDeviceRepository = new TrustedDeviceRepository();

import type { DeviceType } from "@prisma/client";
import { prisma } from "@/database";

export class SessionRepository {
  async create(data: {
    userId: string;
    deviceName?: string;
    deviceType: DeviceType;
    userAgent?: string;
    ip?: string;
    rememberMe: boolean;
    expiresAt: Date;
  }) {
    return prisma.session.create({ data });
  }

  async findById(id: string) {
    return prisma.session.findFirst({
      where: { id, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  async findByUserId(userId: string) {
    return prisma.session.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { lastActiveAt: "desc" },
    });
  }

  async touch(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    });
  }

  async revoke(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string, exceptSessionId?: string) {
    return prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
      },
      data: { revokedAt: new Date() },
    });
  }
}

export const sessionRepository = new SessionRepository();

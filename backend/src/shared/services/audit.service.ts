import type { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/database";
import { logger } from "@/shared/services/logger.service";

export interface AuditParams {
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export class AuditService {
  async log(params: AuditParams): Promise<void> {
    const { userId, action, entity, entityId, metadata, ip, userAgent } = params;

    logger.info(`Audit: ${action} ${entity}`, { userId, entityId });

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        ip,
        userAgent,
      },
    });
  }

  async logCreate(entity: string, entityId: string, ctx: { userId?: string; ip?: string; userAgent?: string }, metadata?: Record<string, unknown>) {
    await this.log({ ...ctx, action: "CREATE", entity, entityId, metadata });
  }

  async logUpdate(entity: string, entityId: string, ctx: { userId?: string; ip?: string; userAgent?: string }, metadata?: Record<string, unknown>) {
    await this.log({ ...ctx, action: "UPDATE", entity, entityId, metadata });
  }

  async logDelete(entity: string, entityId: string, ctx: { userId?: string; ip?: string; userAgent?: string }) {
    await this.log({ ...ctx, action: "DELETE", entity, entityId });
  }

  async logStatusChange(entity: string, entityId: string, ctx: { userId?: string; ip?: string; userAgent?: string }, from: string, to: string) {
    await this.log({ ...ctx, action: "STATUS_CHANGE", entity, entityId, metadata: { from, to } });
  }

  async logLogin(userId: string, ip?: string, userAgent?: string) {
    await this.log({ userId, action: "LOGIN", entity: "User", entityId: userId, ip, userAgent });
  }

  async logUpload(userId: string, uploadId: string, ip?: string, userAgent?: string) {
    await this.log({ userId, action: "UPLOAD", entity: "Upload", entityId: uploadId, ip, userAgent });
  }
}

export const auditService = new AuditService();

import { NotFoundError } from "@/shared/types/errors";
import { notificationRepository } from "@/modules/notifications/repositories/notification.repository";
import type { CreateNotificationInput, UpdateNotificationInput } from "@/modules/notifications/validators/notification.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class NotificationService {
  async list(params: PaginationParams) {
    const { data, total } = await notificationRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new NotFoundError("Notificação não encontrada.", "NOTIFICATION_NOT_FOUND");
    return notification;
  }

  async create(input: CreateNotificationInput, ctx: RequestContext) {
    const notification = await notificationRepository.create(input);
    await auditService.logCreate("Notification", notification.id, ctx);
    return notification;
  }

  async update(id: string, input: UpdateNotificationInput, ctx: RequestContext) {
    await this.getById(id);
    const notification = await notificationRepository.update(id, input);
    await auditService.logUpdate("Notification", id, ctx, { changes: input });
    return notification;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await notificationRepository.softDelete(id);
    await auditService.logDelete("Notification", id, ctx);
  }
}

export const notificationService = new NotificationService();

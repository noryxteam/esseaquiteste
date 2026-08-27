import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateNotificationInput, UpdateNotificationInput } from "@/modules/notifications/validators/notification.validator";

const SORT_FIELDS = ["createdAt", "lida", "tipo"];
const SEARCH_FIELDS = ["titulo", "mensagem"];
const include = { usuario: { select: { id: true, nome: true, email: true } } };

export class NotificationRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.notification.findMany({ ...args, include }),
      (args) => prisma.notification.count(args),
      where, params, SORT_FIELDS
    );
  }

  async findById(id: string) {
    return prisma.notification.findFirst({ where: { id, ...softDeleteWhere() }, include });
  }

  async create(data: CreateNotificationInput) {
    return prisma.notification.create({ data, include });
  }

  async update(id: string, data: UpdateNotificationInput) {
    return prisma.notification.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    return prisma.notification.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const notificationRepository = new NotificationRepository();

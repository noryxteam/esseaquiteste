import { prisma } from "@/database";
import type { NotificationType, UserRole } from "@prisma/client";
import { logger } from "@/shared/services/logger.service";

interface NotifyParams {
  roles?: UserRole[];
  userIds?: string[];
  titulo: string;
  mensagem: string;
  tipo?: NotificationType;
  link?: string | null;
}

export class NotificationDispatchService {
  async notify(params: NotifyParams): Promise<void> {
    const users = await this.resolveRecipients(params);
    if (users.length === 0) return;

    await prisma.notification.createMany({
      data: users.map((u) => ({
        usuarioId: u.id,
        titulo: params.titulo,
        mensagem: params.mensagem,
        tipo: params.tipo ?? "INFO",
        link: params.link ?? null,
      })),
    });

    logger.info("Notifications dispatched", {
      count: users.length,
      titulo: params.titulo,
    });
  }

  private async resolveRecipients(params: NotifyParams) {
    if (params.userIds?.length) {
      return prisma.user.findMany({
        where: { id: { in: params.userIds }, deletedAt: null, ativo: true },
        select: { id: true },
      });
    }

    if (params.roles?.length) {
      return prisma.user.findMany({
        where: { role: { in: params.roles }, deletedAt: null, ativo: true },
        select: { id: true },
      });
    }

    return [];
  }
}

export const notificationDispatch = new NotificationDispatchService();

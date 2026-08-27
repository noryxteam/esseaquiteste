import { notificationDispatch } from "@/shared/services/notification-dispatch.service";
import type { AnyDomainEvent } from "@/shared/events/types";
import { DomainEventType } from "@/shared/events/types";

export const notificationHandler = {
  async handle(event: AnyDomainEvent): Promise<void> {
    switch (event.type) {
      case DomainEventType.CLIENT_CREATED:
        await notificationDispatch.notify({
          roles: ["COMERCIAL", "ADMINISTRADOR"],
          titulo: "Novo cliente",
          mensagem: `${event.payload.empresa} foi adicionado à base.`,
          tipo: "SUCCESS",
          link: `/clientes`,
        });
        break;
      case DomainEventType.CONTRACT_SIGNED:
        await notificationDispatch.notify({
          roles: ["COMERCIAL", "ADMINISTRADOR", "FINANCEIRO"],
          titulo: "Contrato assinado",
          mensagem: `Contrato ${event.payload.numeroContrato} foi assinado.`,
          tipo: "SUCCESS",
          link: `/contratos`,
        });
        break;
      case DomainEventType.PAYMENT_CONFIRMED:
        await notificationDispatch.notify({
          roles: ["FINANCEIRO", "ADMINISTRADOR"],
          titulo: "Pagamento recebido",
          mensagem: event.payload.descricao,
          tipo: "SUCCESS",
          link: `/financeiro`,
        });
        break;
      case DomainEventType.MEETING_FINISHED:
        await notificationDispatch.notify({
          roles: ["COMERCIAL", "ADMINISTRADOR"],
          titulo: "Reunião concluída",
          mensagem: event.payload.titulo,
          tipo: "INFO",
          link: `/reunioes`,
        });
        break;
      case DomainEventType.PROJECT_COMPLETED:
        await notificationDispatch.notify({
          roles: ["COMERCIAL", "ADMINISTRADOR"],
          titulo: "Projeto concluído",
          mensagem: event.payload.nome,
          tipo: "SUCCESS",
          link: `/projetos`,
        });
        break;
      case DomainEventType.PROJECT_UPDATED: {
        const today = new Date().toISOString().split("T")[0];
        if (event.payload.status !== "CONCLUIDO" && event.payload.status !== "CANCELADO") {
          // Notificação de atraso verificada no integration handler
        }
        break;
      }
      default:
        break;
    }
  },
};

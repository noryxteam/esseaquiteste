import { timelineService } from "@/shared/services/timeline.service";
import type { AnyDomainEvent } from "@/shared/events/types";
import { DomainEventType } from "@/shared/events/types";

export const timelineHandler = {
  async handle(event: AnyDomainEvent): Promise<void> {
    const ctx = event.context;
    const userId = ctx?.userId;

    switch (event.type) {
      case DomainEventType.CLIENT_CREATED:
        await timelineService.onClientCreated(event.payload.clientId, event.payload.empresa, userId);
        break;
      case DomainEventType.PROJECT_CREATED:
        await timelineService.onProjectStarted(
          event.payload.projectId,
          event.payload.clienteId,
          event.payload.nome,
          userId
        );
        break;
      case DomainEventType.PROJECT_COMPLETED:
        await timelineService.create({
          tipo: "PROJETO_CONCLUIDO",
          titulo: "Projeto concluído",
          descricao: event.payload.nome,
          clienteId: event.payload.clienteId,
          projetoId: event.payload.projectId,
          usuarioId: userId,
        });
        break;
      case DomainEventType.CONTRACT_CREATED:
        await timelineService.onContractSent(
          event.payload.contractId,
          event.payload.clienteId,
          event.payload.projetoId,
          event.payload.numeroContrato
        );
        break;
      case DomainEventType.CONTRACT_SIGNED:
        await timelineService.onContractSigned(
          event.payload.contractId,
          event.payload.clienteId,
          event.payload.projetoId,
          event.payload.numeroContrato
        );
        break;
      case DomainEventType.PAYMENT_CONFIRMED:
        await timelineService.onPaymentReceived(
          event.payload.clienteId,
          event.payload.contratoId,
          event.payload.descricao,
          userId
        );
        break;
      case DomainEventType.PAYMENT_PENDING:
        await timelineService.create({
          tipo: "PAGAMENTO_PENDENTE",
          titulo: "Pagamento pendente",
          descricao: event.payload.descricao,
          clienteId: event.payload.clienteId,
          contratoId: event.payload.contratoId,
          usuarioId: userId,
        });
        break;
      case DomainEventType.MEETING_FINISHED:
        await timelineService.onMeetingCompleted(
          event.payload.meetingId,
          event.payload.clienteId,
          event.payload.projetoId,
          event.payload.titulo,
          userId
        );
        break;
      case DomainEventType.BRIEFING_CREATED:
        await timelineService.onBriefingCreated(
          event.payload.briefingId,
          event.payload.clienteId,
          event.payload.projetoId
        );
        break;
      case DomainEventType.FILE_UPLOADED:
        await timelineService.onFileUploaded(
          event.payload.fileId,
          event.payload.clienteId,
          event.payload.projetoId,
          event.payload.nome
        );
        break;
      case DomainEventType.TASK_COMPLETED:
        await timelineService.onTaskCompleted(
          event.payload.taskId,
          event.payload.clienteId,
          event.payload.projetoId,
          event.payload.titulo,
          userId
        );
        break;
      default:
        break;
    }
  },
};

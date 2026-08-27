import { getSeedData, recomputeDerivedState } from "@/mock/seed";
import { isoDate } from "@/mock/common/utils";
import type { MockNotification } from "@/mock/notifications/types";
import type { MockTimelineEvent, TimelineEventType } from "@/mock/timeline/types";
import type { AnyDomainEvent } from "@/modules/integration/types";
import { DomainEventType } from "@/modules/integration/types";
import { invalidateModules } from "@/modules/integration/emit";

function nextId(prefix: string): string {
  const seed = getSeedData();
  const count = seed.timeline.length + seed.notifications.length + 1;
  return `${prefix}-${String(count).padStart(4, "0")}`;
}

function pushTimeline(partial: Omit<MockTimelineEvent, "id">): void {
  const seed = getSeedData();
  seed.timeline.unshift({ id: nextId("tl"), ...partial });
}

function pushNotification(partial: {
  titulo: string;
  mensagem: string;
  tipo: MockNotification["tipo"];
  link: string | null;
}): void {
  const seed = getSeedData();
  const admin = seed.users.find((u) => u.role === "administrador");
  if (!admin) return;
  seed.notifications.unshift({
    id: nextId("ntf"),
    criadoEm: isoDate(2024, 7, 8),
    lida: false,
    usuarioId: admin.id,
    ...partial,
  });
}

function timelineTypeFor(event: AnyDomainEvent): TimelineEventType | null {
  const map: Partial<Record<DomainEventType, TimelineEventType>> = {
    [DomainEventType.CLIENT_CREATED]: "cliente-criado",
    [DomainEventType.PROJECT_CREATED]: "projeto-iniciado",
    [DomainEventType.PROJECT_COMPLETED]: "projeto-concluido",
    [DomainEventType.CONTRACT_CREATED]: "contrato-enviado",
    [DomainEventType.CONTRACT_SIGNED]: "contrato-assinado",
    [DomainEventType.PAYMENT_CONFIRMED]: "pagamento-recebido",
    [DomainEventType.PAYMENT_PENDING]: "pagamento-pendente",
    [DomainEventType.MEETING_FINISHED]: "reuniao-realizada",
    [DomainEventType.BRIEFING_CREATED]: "briefing-criado",
    [DomainEventType.FILE_UPLOADED]: "arquivo-enviado",
    [DomainEventType.TASK_COMPLETED]: "tarefa-concluida",
  };
  return map[event.type] ?? null;
}

export const localTimelineHandler = {
  handle(event: AnyDomainEvent): void {
    const tipo = timelineTypeFor(event);
    if (!tipo) return;

    const today = isoDate(2024, 7, 8);

    switch (event.type) {
      case DomainEventType.CLIENT_CREATED:
        pushTimeline({
          tipo,
          titulo: "Cliente criado",
          descricao: event.payload.empresa,
          data: today,
          hora: "09:00",
          clienteId: event.payload.clientId,
          projetoId: null,
          contratoId: null,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.PROJECT_CREATED:
        pushTimeline({
          tipo,
          titulo: "Projeto iniciado",
          descricao: event.payload.nome,
          data: today,
          hora: "10:00",
          clienteId: event.payload.clienteId,
          projetoId: event.payload.projectId,
          contratoId: null,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.PROJECT_COMPLETED:
        pushTimeline({
          tipo,
          titulo: "Projeto concluído",
          descricao: event.payload.nome,
          data: today,
          hora: "17:00",
          clienteId: event.payload.clienteId,
          projetoId: event.payload.projectId,
          contratoId: null,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.CONTRACT_CREATED:
        pushTimeline({
          tipo,
          titulo: "Contrato enviado",
          descricao: event.payload.numeroContrato,
          data: today,
          hora: "11:00",
          clienteId: event.payload.clienteId,
          projetoId: event.payload.projetoId,
          contratoId: event.payload.contractId,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.CONTRACT_SIGNED:
        pushTimeline({
          tipo,
          titulo: "Contrato assinado",
          descricao: event.payload.numeroContrato,
          data: today,
          hora: "14:00",
          clienteId: event.payload.clienteId,
          projetoId: null,
          contratoId: event.payload.contractId,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.PAYMENT_CONFIRMED:
        pushTimeline({
          tipo,
          titulo: "Pagamento recebido",
          descricao: event.payload.descricao,
          data: today,
          hora: "15:00",
          clienteId: null,
          projetoId: null,
          contratoId: null,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.MEETING_FINISHED:
        pushTimeline({
          tipo,
          titulo: "Reunião realizada",
          descricao: event.payload.titulo,
          data: today,
          hora: "16:00",
          clienteId: event.payload.clienteId,
          projetoId: event.payload.projetoId,
          contratoId: null,
          reuniaoId: event.payload.meetingId,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.BRIEFING_CREATED:
        pushTimeline({
          tipo,
          titulo: "Briefing criado",
          descricao: "Novo briefing registrado",
          data: today,
          hora: "12:00",
          clienteId: event.payload.clienteId,
          projetoId: event.payload.projetoId,
          contratoId: null,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      case DomainEventType.FILE_UPLOADED:
        pushTimeline({
          tipo,
          titulo: "Arquivo enviado",
          descricao: event.payload.nome,
          data: today,
          hora: "13:00",
          clienteId: event.payload.clienteId,
          projetoId: event.payload.projetoId,
          contratoId: null,
          reuniaoId: null,
          arquivoId: event.payload.fileId,
          usuarioId: null,
        });
        break;
      case DomainEventType.TASK_COMPLETED:
        pushTimeline({
          tipo,
          titulo: "Tarefa concluída",
          descricao: event.payload.titulo,
          data: today,
          hora: "18:00",
          clienteId: null,
          projetoId: null,
          contratoId: null,
          reuniaoId: null,
          arquivoId: null,
          usuarioId: null,
        });
        break;
      default:
        break;
    }
  },
};

export const localNotificationHandler = {
  handle(event: AnyDomainEvent): void {
    switch (event.type) {
      case DomainEventType.CLIENT_CREATED:
        pushNotification({
          titulo: "Novo cliente",
          mensagem: `${event.payload.empresa} foi adicionado à base.`,
          tipo: "success",
          link: "/clientes",
        });
        break;
      case DomainEventType.CONTRACT_SIGNED:
        pushNotification({
          titulo: "Contrato assinado",
          mensagem: `Contrato ${event.payload.numeroContrato} foi assinado.`,
          tipo: "success",
          link: "/contratos",
        });
        break;
      case DomainEventType.PAYMENT_CONFIRMED:
        pushNotification({
          titulo: "Pagamento recebido",
          mensagem: event.payload.descricao,
          tipo: "success",
          link: "/financeiro",
        });
        break;
      case DomainEventType.MEETING_FINISHED:
        pushNotification({
          titulo: "Reunião concluída",
          mensagem: event.payload.titulo,
          tipo: "info",
          link: "/reunioes",
        });
        break;
      case DomainEventType.PROJECT_COMPLETED:
        pushNotification({
          titulo: "Projeto concluído",
          mensagem: event.payload.nome,
          tipo: "success",
          link: "/projetos",
        });
        break;
      case DomainEventType.PROJECT_UPDATED:
        if (event.payload.status !== "concluido" && event.payload.status !== "cancelado") {
          const project = getSeedData().projects.find((p) => p.id === event.payload.projectId);
          if (project && project.prazo < isoDate(2024, 7, 8)) {
            pushNotification({
              titulo: "Projeto atrasado",
              mensagem: `${event.payload.nome} ultrapassou o prazo.`,
              tipo: "warning",
              link: "/projetos",
            });
          }
        }
        break;
      default:
        break;
    }
  },
};

export const localStateHandler = {
  async handle(event: AnyDomainEvent): Promise<void> {
    if (event.type === DomainEventType.STATE_INVALIDATED) return;
    recomputeDerivedState(getSeedData());
    await invalidateModules(event.affectedModules);
  },
};

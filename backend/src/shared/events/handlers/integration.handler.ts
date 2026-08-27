import { prisma } from "@/database";
import { eventBus } from "@/shared/events/event-bus";
import { DomainEventType, type AnyDomainEvent, type DomainEvent } from "@/shared/events/types";
import { notificationDispatch } from "@/shared/services/notification-dispatch.service";
import { logger } from "@/shared/services/logger.service";

/**
 * Efeitos colaterais entre módulos — briefing/tasks automáticos, alertas de prazo, etc.
 */
export const integrationHandler = {
  async handle(event: AnyDomainEvent): Promise<void> {
    switch (event.type) {
      case DomainEventType.MEETING_FINISHED:
        await handleMeetingFinished(event);
        break;
      case DomainEventType.PROJECT_CREATED:
        await ensureProjectBriefingStub(event);
        break;
      case DomainEventType.PROJECT_UPDATED:
        await checkProjectOverdue(event);
        break;
      case DomainEventType.CONTRACT_STATUS_CHANGED:
        await syncContractToProject(event);
        break;
      case DomainEventType.PAYMENT_CONFIRMED:
        await syncPaymentToContract(event);
        break;
      default:
        break;
    }
  },
};

async function handleMeetingFinished(event: DomainEvent<DomainEventType.MEETING_FINISHED>) {
  const { meetingId, clienteId, projetoId, titulo } = event.payload;
  const userId = event.context?.userId;

  let briefingId = event.payload.briefingId;
  const taskIds: string[] = [];

  const existingBriefing = await prisma.briefing.findFirst({
    where: { projetoId, deletedAt: null },
  });

  if (!existingBriefing) {
    const briefing = await prisma.briefing.create({
      data: {
        clienteId,
        projetoId,
        resumo: `Briefing gerado automaticamente após reunião: ${titulo}`,
        objetivos: ["Consolidar decisões da reunião", "Definir próximos passos"],
        escopo: ["Resumo da reunião", "Ações definidas"],
        decisoes: ["Reunião registrada no sistema"],
        pendencias: ["Validar resumo com o cliente"],
        tarefas: ["Enviar ata da reunião", "Atualizar cronograma"],
        observacoes: ["Gerado automaticamente — revisar conteúdo"],
      },
    });
    briefingId = briefing.id;

    await eventBus.emit({
      type: DomainEventType.BRIEFING_CREATED,
      payload: { briefingId: briefing.id, clienteId, projetoId },
      context: event.context,
      affectedModules: ["briefings", "timeline", "dashboard", "search"],
      timestamp: new Date(),
    });
  }

  const project = await prisma.project.findUnique({ where: { id: projetoId } });
  const responsavelId = project?.responsavelId ?? userId;
  if (!responsavelId) return;

  const mockTasks = [
    `Enviar resumo da reunião — ${titulo}`,
    `Atualizar escopo do projeto`,
    `Agendar follow-up com cliente`,
  ];

  for (const tituloTask of mockTasks) {
    const task = await prisma.task.create({
      data: {
        projetoId,
        clienteId,
        titulo: tituloTask,
        descricao: `Tarefa gerada automaticamente após reunião ${meetingId}`,
        responsavelId,
        prazo: new Date(Date.now() + 7 * 86_400_000),
        status: "PENDENTE",
        prioridade: "MEDIA",
      },
    });
    taskIds.push(task.id);

    await eventBus.emit({
      type: DomainEventType.TASK_CREATED,
      payload: {
        taskId: task.id,
        clienteId,
        projetoId,
        titulo: task.titulo,
      },
      context: event.context,
      affectedModules: ["tasks", "dashboard", "notifications"],
      timestamp: new Date(),
    });
  }

  logger.info("Meeting integration completed", { meetingId, briefingId, tasks: taskIds.length });
}

async function ensureProjectBriefingStub(event: DomainEvent<DomainEventType.PROJECT_CREATED>) {
  const { projectId, clienteId, nome } = event.payload;

  const exists = await prisma.briefing.findFirst({
    where: { projetoId: projectId, deletedAt: null },
  });
  if (exists) return;

  const briefing = await prisma.briefing.create({
    data: {
      clienteId,
      projetoId: projectId,
      resumo: `Briefing inicial do projeto ${nome}`,
      objetivos: ["Definir escopo", "Alinhar expectativas"],
      escopo: ["Discovery"],
      decisoes: [],
      pendencias: ["Agendar kickoff"],
      tarefas: ["Coletar materiais do cliente"],
      observacoes: [],
    },
  });

  await eventBus.emit({
    type: DomainEventType.BRIEFING_CREATED,
    payload: { briefingId: briefing.id, clienteId, projetoId: projectId },
    context: event.context,
    affectedModules: ["briefings", "timeline", "dashboard", "search"],
    timestamp: new Date(),
  });
}

async function checkProjectOverdue(event: DomainEvent<DomainEventType.PROJECT_UPDATED>) {
  const project = await prisma.project.findUnique({ where: { id: event.payload.projectId } });
  if (!project) return;

  const today = new Date();
  if (
    project.prazo < today &&
    project.status !== "CONCLUIDO" &&
    project.status !== "CANCELADO"
  ) {
    await notificationDispatch.notify({
      roles: ["COMERCIAL", "ADMINISTRADOR"],
      userIds: [project.responsavelId],
      titulo: "Projeto atrasado",
      mensagem: `${project.nome} ultrapassou o prazo.`,
      tipo: "WARNING",
      link: `/projetos`,
    });
  }
}

async function syncContractToProject(event: DomainEvent<DomainEventType.CONTRACT_STATUS_CHANGED>) {
  if (event.payload.to === "ASSINADO" || event.payload.to === "FINALIZADO") {
    await prisma.project.updateMany({
      where: { id: event.payload.projetoId },
      data: { progresso: { increment: 10 } },
    });
  }
}

async function syncPaymentToContract(event: DomainEvent<DomainEventType.PAYMENT_CONFIRMED>) {
  if (!event.payload.contratoId) return;

  const paid = await prisma.financeMovement.aggregate({
    where: {
      contratoId: event.payload.contratoId,
      tipo: "RECEITA",
      status: "PAGO",
      deletedAt: null,
    },
    _sum: { valor: true },
  });

  const contract = await prisma.contract.findUnique({ where: { id: event.payload.contratoId } });
  if (!contract) return;

  const totalPaid = Number(paid._sum.valor ?? 0);
  const contractValue = Number(contract.valor);

  if (totalPaid >= contractValue && contract.status !== "FINALIZADO") {
    await prisma.contract.update({
      where: { id: contract.id },
      data: { status: "FINALIZADO" },
    });
  }
}

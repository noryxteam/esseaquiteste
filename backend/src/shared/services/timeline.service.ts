import type { TimelineEventType } from "@prisma/client";
import { prisma } from "@/database";

export interface CreateTimelineEventParams {
  tipo: TimelineEventType;
  titulo: string;
  descricao: string;
  data?: Date;
  hora?: string;
  clienteId?: string | null;
  projetoId?: string | null;
  contratoId?: string | null;
  reuniaoId?: string | null;
  arquivoId?: string | null;
  usuarioId?: string | null;
}

export class TimelineService {
  async create(params: CreateTimelineEventParams) {
    const now = new Date();
    const hora = params.hora ?? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    return prisma.timelineEvent.create({
      data: {
        tipo: params.tipo,
        titulo: params.titulo,
        descricao: params.descricao,
        data: params.data ?? now,
        hora,
        clienteId: params.clienteId ?? null,
        projetoId: params.projetoId ?? null,
        contratoId: params.contratoId ?? null,
        reuniaoId: params.reuniaoId ?? null,
        arquivoId: params.arquivoId ?? null,
        usuarioId: params.usuarioId ?? null,
      },
    });
  }

  async onClientCreated(clienteId: string, empresa: string, usuarioId?: string) {
    return this.create({
      tipo: "CLIENTE_CRIADO",
      titulo: "Cliente criado",
      descricao: `${empresa} adicionado à base`,
      clienteId,
      usuarioId,
    });
  }

  async onProjectStarted(projetoId: string, clienteId: string, nome: string, usuarioId?: string) {
    return this.create({
      tipo: "PROJETO_INICIADO",
      titulo: "Projeto iniciado",
      descricao: nome,
      projetoId,
      clienteId,
      usuarioId,
    });
  }

  async onContractSent(contratoId: string, clienteId: string, projetoId: string, numero: string) {
    return this.create({
      tipo: "CONTRATO_ENVIADO",
      titulo: "Contrato enviado",
      descricao: numero,
      contratoId,
      clienteId,
      projetoId,
    });
  }

  async onContractSigned(contratoId: string, clienteId: string, projetoId: string, numero: string) {
    return this.create({
      tipo: "CONTRATO_ASSINADO",
      titulo: "Contrato assinado",
      descricao: numero,
      contratoId,
      clienteId,
      projetoId,
    });
  }

  async onPaymentReceived(clienteId: string, contratoId: string | null, descricao: string, usuarioId?: string) {
    return this.create({
      tipo: "PAGAMENTO_RECEBIDO",
      titulo: "Pagamento recebido",
      descricao,
      clienteId,
      contratoId,
      usuarioId,
    });
  }

  async onMeetingCompleted(reuniaoId: string, clienteId: string, projetoId: string, titulo: string, usuarioId?: string) {
    return this.create({
      tipo: "REUNIAO_REALIZADA",
      titulo: "Reunião realizada",
      descricao: titulo,
      reuniaoId,
      clienteId,
      projetoId,
      usuarioId,
    });
  }

  async onFileUploaded(arquivoId: string, clienteId: string, projetoId: string, nome: string) {
    return this.create({
      tipo: "ARQUIVO_ENVIADO",
      titulo: "Arquivo enviado",
      descricao: nome,
      arquivoId,
      clienteId,
      projetoId,
    });
  }

  async onBriefingCreated(briefingId: string, clienteId: string, projetoId: string) {
    return this.create({
      tipo: "BRIEFING_CRIADO",
      titulo: "Briefing criado",
      descricao: `Briefing do projeto ${projetoId}`,
      clienteId,
      projetoId,
    });
  }

  async onTaskCompleted(taskId: string, clienteId: string, projetoId: string, titulo: string, usuarioId?: string) {
    return this.create({
      tipo: "TAREFA_CONCLUIDA",
      titulo: "Tarefa concluída",
      descricao: titulo,
      clienteId,
      projetoId,
      usuarioId,
    });
  }
}

export const timelineService = new TimelineService();

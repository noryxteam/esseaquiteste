import { z } from "zod";

export const timelineEventTypeSchema = z.enum([
  "CLIENTE_CRIADO", "PROJETO_INICIADO", "PROJETO_APROVADO", "PROJETO_CONCLUIDO",
  "CONTRATO_ENVIADO", "CONTRATO_ASSINADO", "PAGAMENTO_RECEBIDO", "PAGAMENTO_PENDENTE",
  "REUNIAO_REALIZADA", "ARQUIVO_ENVIADO", "BRIEFING_CRIADO", "TAREFA_CONCLUIDA",
]);

export const createTimelineSchema = z.object({
  tipo: timelineEventTypeSchema,
  titulo: z.string().min(2).max(200),
  descricao: z.string().min(1),
  data: z.coerce.date().optional(),
  hora: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  clienteId: z.string().cuid().optional().nullable(),
  projetoId: z.string().cuid().optional().nullable(),
  contratoId: z.string().cuid().optional().nullable(),
  reuniaoId: z.string().cuid().optional().nullable(),
  arquivoId: z.string().cuid().optional().nullable(),
  usuarioId: z.string().cuid().optional().nullable(),
});

export type CreateTimelineInput = z.infer<typeof createTimelineSchema>;

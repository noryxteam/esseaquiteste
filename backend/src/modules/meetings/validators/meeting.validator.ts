import { z } from "zod";

export const meetingStatusSchema = z.enum(["AGENDADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]);

export const createMeetingSchema = z.object({
  clienteId: z.string().cuid(),
  projetoId: z.string().cuid(),
  titulo: z.string().min(2).max(200),
  data: z.coerce.date(),
  inicio: z.string().regex(/^\d{2}:\d{2}$/),
  fim: z.string().regex(/^\d{2}:\d{2}$/),
  status: meetingStatusSchema.optional(),
  gravacao: z.boolean().optional(),
  transcricao: z.boolean().optional(),
  briefingId: z.string().cuid().optional().nullable(),
  participantIds: z.array(z.string().cuid()).optional(),
});

export const updateMeetingSchema = createMeetingSchema.partial();
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;

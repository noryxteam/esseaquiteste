import { z } from "zod";

export const taskStatusSchema = z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]);
export const taskPrioritySchema = z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]);

export const createTaskSchema = z.object({
  projetoId: z.string().cuid(),
  clienteId: z.string().cuid(),
  titulo: z.string().min(2).max(200),
  descricao: z.string().min(1),
  status: taskStatusSchema.optional(),
  responsavelId: z.string().cuid(),
  prioridade: taskPrioritySchema.optional(),
  prazo: z.coerce.date(),
  concluidoEm: z.coerce.date().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

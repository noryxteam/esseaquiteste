import { z } from "zod";

export const projectStatusSchema = z.enum([
  "PLANEJAMENTO",
  "EM_ANDAMENTO",
  "PAUSADO",
  "CONCLUIDO",
  "CANCELADO",
]);

export const projectPrioritySchema = z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]);

export const createProjectSchema = z.object({
  clienteId: z.string().cuid(),
  nome: z.string().min(2).max(200),
  descricao: z.string().min(1),
  status: projectStatusSchema.optional(),
  progresso: z.number().int().min(0).max(100).optional(),
  responsavelId: z.string().cuid(),
  dataInicio: z.coerce.date(),
  prazo: z.coerce.date(),
  prioridade: projectPrioritySchema.optional(),
  valor: z.coerce.number().positive(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

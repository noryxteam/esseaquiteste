import { z } from "zod";

export const createBriefingSchema = z.object({
  clienteId: z.string().cuid(),
  projetoId: z.string().cuid(),
  resumo: z.string().min(1),
  objetivos: z.array(z.string()).default([]),
  escopo: z.array(z.string()).default([]),
  decisoes: z.array(z.string()).default([]),
  pendencias: z.array(z.string()).default([]),
  tarefas: z.array(z.string()).default([]),
  observacoes: z.array(z.string()).default([]),
});

export const updateBriefingSchema = createBriefingSchema.partial();
export type CreateBriefingInput = z.infer<typeof createBriefingSchema>;
export type UpdateBriefingInput = z.infer<typeof updateBriefingSchema>;

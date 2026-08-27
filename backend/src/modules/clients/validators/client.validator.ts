import { z } from "zod";

export const clientStatusSchema = z.enum(["ATIVO", "INATIVO", "PROSPECTO", "CHURN"]);

export const createClientSchema = z.object({
  nome: z.string().min(2).max(120),
  empresa: z.string().min(2).max(200),
  email: z.string().email(),
  telefone: z.string().max(20).optional().nullable(),
  segmento: z.string().min(2).max(80),
  cidade: z.string().min(2).max(100),
  estado: z.string().length(2),
  status: clientStatusSchema.optional(),
  responsavelId: z.string().cuid(),
  avatar: z.string().url().optional().nullable(),
  ultimoContato: z.coerce.date().optional().nullable(),
  proximoContato: z.coerce.date().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

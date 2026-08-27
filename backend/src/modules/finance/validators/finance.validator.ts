import { z } from "zod";

export const financeTypeSchema = z.enum(["RECEITA", "DESPESA", "TRANSFERENCIA"]);
export const financeStatusSchema = z.enum(["PENDENTE", "PAGO", "ATRASADO", "CANCELADO"]);

export const createFinanceSchema = z.object({
  clienteId: z.string().cuid(),
  contratoId: z.string().cuid().optional().nullable(),
  tipo: financeTypeSchema,
  categoria: financeTypeSchema,
  valor: z.coerce.number().positive(),
  status: financeStatusSchema.optional(),
  data: z.coerce.date(),
  formaPagamento: z.string().min(2).max(50),
  descricao: z.string().min(1),
});

export const updateFinanceSchema = createFinanceSchema.partial();
export type CreateFinanceInput = z.infer<typeof createFinanceSchema>;
export type UpdateFinanceInput = z.infer<typeof updateFinanceSchema>;

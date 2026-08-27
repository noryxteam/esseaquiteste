import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().cuid("ID inválido"),
});

/** Contratos usam id local (ctr-…), cuid Prisma ou slug público. */
export const contractIdParamSchema = z.object({
  id: z.string().min(1).max(128),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

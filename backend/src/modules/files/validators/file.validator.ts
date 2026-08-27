import { z } from "zod";

export const fileCategorySchema = z.enum([
  "CONTRATO", "BRIEFING", "DESIGN", "DOCUMENTO", "IMAGEM", "VIDEO", "PLANILHA", "OUTRO",
]);

export const createFileSchema = z.object({
  clienteId: z.string().cuid(),
  projetoId: z.string().cuid(),
  nome: z.string().min(1).max(255),
  tipo: z.string().min(1).max(20),
  tamanho: z.number().int().positive(),
  url: z.string().min(1),
  categoria: fileCategorySchema.optional(),
  uploadId: z.string().cuid().optional().nullable(),
});

export const updateFileSchema = createFileSchema.partial();
export type CreateFileInput = z.infer<typeof createFileSchema>;
export type UpdateFileInput = z.infer<typeof updateFileSchema>;

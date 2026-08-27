import { z } from "zod";

export const notificationTypeSchema = z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]);

export const createNotificationSchema = z.object({
  usuarioId: z.string().cuid(),
  titulo: z.string().min(2).max(200),
  mensagem: z.string().min(1),
  tipo: notificationTypeSchema.optional(),
  lida: z.boolean().optional(),
  link: z.string().optional().nullable(),
});

export const updateNotificationSchema = createNotificationSchema.partial();
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;

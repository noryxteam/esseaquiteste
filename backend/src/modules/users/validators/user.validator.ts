import { z } from "zod";

export const userRoleSchema = z.enum([
  "ADMINISTRADOR", "DESIGNER", "DESENVOLVEDOR", "FINANCEIRO", "COMERCIAL", "CLIENTE",
]);

export const createUserSchema = z.object({
  nome: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: userRoleSchema.optional(),
  avatar: z.string().url().optional().nullable(),
  ativo: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(8).max(128).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

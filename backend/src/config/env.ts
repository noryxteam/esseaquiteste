import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3333),
  API_PREFIX: z.string().default("/api/v1"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8).default("dev-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(8).default("dev-refresh-secret-change-me"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  /** Painel admin faz muitas requisições; 100/15min era facilmente estourado por syncs. */
  RATE_LIMIT_MAX: z.coerce.number().default(2_000),
  UPLOAD_MAX_SIZE_MB: z.coerce.number().default(50),
  UPLOAD_LOCAL_PATH: z.string().default("./uploads"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  ACCESS_CODE_PEPPER: z.string().min(8).default("norax-access-code-pepper"),
  PORTAL_TOKEN_SECRET: z.string().min(8).default("norax-portal-token-secret"),
  APP_PUBLIC_URL: z.string().default("http://localhost:3000"),
  API_PUBLIC_URL: z.string().default("http://127.0.0.1:3333/api/v1"),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_SECURE: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => {
      if (typeof v === "boolean") return v;
      if (v == null || v === "") return false;
      return v === "true" || v === "1";
    }),
  MAIL_USER: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_FROM_NAME: z.string().default("Norax"),
  MAIL_FROM_EMAIL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const data = parsed.data;

export const env = {
  ...data,
  MAIL_FROM_EMAIL: data.MAIL_FROM_EMAIL || data.MAIL_USER || "noreply@norax.local",
};

/**
 * Configuração SMTP (Gmail / Nodemailer).
 * Credenciais vêm exclusivamente do .env — nada fixo no código.
 */

export const MAIL_ENV_KEYS = [
  "MAIL_HOST",
  "MAIL_PORT",
  "MAIL_SECURE",
  "MAIL_USER",
  "MAIL_PASSWORD",
  "MAIL_FROM_NAME",
  "MAIL_FROM_EMAIL",
] as const;

export type MailEnvKey = (typeof MAIL_ENV_KEYS)[number];

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
}

export class MailConfigError extends Error {
  readonly missing: MailEnvKey[];

  constructor(missing: MailEnvKey[]) {
    const list = missing.join(", ");
    super(
      missing.length === 1
        ? `Configuração de e-mail incompleta. Variável ausente no .env: ${list}`
        : `Configuração de e-mail incompleta. Variáveis ausentes no .env: ${list}`
    );
    this.name = "MailConfigError";
    this.missing = missing;
  }
}

function readRaw(key: string): string | undefined {
  const value = process.env[key];
  if (value == null || value.trim() === "") return undefined;
  return value.trim();
}

function parseSecure(raw: string | undefined): boolean | undefined {
  if (raw == null) return undefined;
  const v = raw.toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "no") return false;
  return undefined;
}

/** Lista exatamente quais variáveis obrigatórias estão faltando. */
export function getMissingMailEnvKeys(): MailEnvKey[] {
  const missing: MailEnvKey[] = [];

  for (const key of MAIL_ENV_KEYS) {
    const value = readRaw(key);
    if (value == null) {
      missing.push(key);
      continue;
    }

    if (key === "MAIL_PORT") {
      const port = Number.parseInt(value, 10);
      if (!Number.isFinite(port) || port <= 0) missing.push(key);
    }

    if (key === "MAIL_SECURE") {
      if (parseSecure(value) === undefined) missing.push(key);
    }
  }

  return missing;
}

/**
 * Valida e retorna a configuração de e-mail.
 * Lança MailConfigError citando cada variável ausente.
 */
export function getMailConfig(): MailConfig {
  const missing = getMissingMailEnvKeys();
  if (missing.length > 0) {
    throw new MailConfigError(missing);
  }

  const host = readRaw("MAIL_HOST")!;
  const port = Number.parseInt(readRaw("MAIL_PORT")!, 10);
  const secure = parseSecure(readRaw("MAIL_SECURE"))!;
  const user = readRaw("MAIL_USER")!;
  const password = readRaw("MAIL_PASSWORD")!;
  const fromName = readRaw("MAIL_FROM_NAME")!;
  const fromEmail = readRaw("MAIL_FROM_EMAIL")!;

  return {
    host,
    port,
    secure,
    user,
    password,
    fromName,
    fromEmail,
  };
}

/** true quando todas as variáveis SMTP obrigatórias estão presentes e válidas. */
export function isMailConfigured(): boolean {
  return getMissingMailEnvKeys().length === 0;
}

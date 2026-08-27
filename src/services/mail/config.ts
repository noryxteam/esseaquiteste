/**
 * @deprecated Use `@/config/mail` — configuração canônica SMTP/Gmail.
 * Mantido para não quebrar imports antigos do módulo.
 */
export {
  getMailConfig as loadMailConfig,
  getMailConfig,
  getMissingMailEnvKeys,
  isMailConfigured,
  MailConfigError,
  MAIL_ENV_KEYS,
  type MailConfig as MailEnvConfig,
  type MailConfig,
} from "@/config/mail";

/**
 * Módulo de e-mail da plataforma.
 *
 * Regra: todo envio passa por `mailService`.
 * SMTP real via Nodemailer (Gmail) — credenciais apenas no .env.
 */

export { mailService, MailService } from "./MailService";
export { MailTemplates, renderMailTemplate } from "./MailTemplates";
export {
  StubMailProvider,
  type MailProvider,
} from "./MailProvider";
export { SmtpMailProvider, smtpMailProvider } from "./SmtpMailProvider";
export {
  getMailConfig,
  getMissingMailEnvKeys,
  isMailConfigured,
  MailConfigError,
  MAIL_ENV_KEYS,
} from "@/config/mail";
export type { MailConfig } from "@/config/mail";
export type {
  AccessCodeData,
  AccessRecoveryData,
  ContractCreatedData,
  ContractSignedData,
  MailAddress,
  MailAttachment,
  MailMessage,
  MailProviderName,
  MailSendResult,
  MailTemplateDataMap,
  MailTemplateId,
  NewDeviceAccessRequestData,
  NotificationData,
  RenderedMailTemplate,
} from "./types";

/**
 * Tipos do módulo de e-mail da plataforma Norax.
 * Nenhum envio real ocorre aqui — apenas contratos compartilhados.
 */

export type MailProviderName =
  | "stub"
  | "smtp"
  | "resend"
  | "sendgrid"
  | "ses"
  | "mailgun";

export interface MailAddress {
  email: string;
  name?: string;
}

export interface MailAttachment {
  /** Nome do arquivo exibido ao destinatário */
  filename: string;
  /** Conteúdo em Base64, Buffer ou caminho local (conforme o provedor) */
  content: string | Buffer;
  contentType?: string;
  /** CID para embutir imagem no HTML (opcional, futuro) */
  cid?: string;
}

export interface MailMessage {
  to: string | string[] | MailAddress | MailAddress[];
  subject: string;
  /** Corpo em texto simples */
  text?: string;
  /** Corpo HTML */
  html?: string;
  cc?: string | string[] | MailAddress | MailAddress[];
  bcc?: string | string[] | MailAddress | MailAddress[];
  replyTo?: string | MailAddress;
  /** Anexos — suportados na interface; provedores reais implementam depois */
  attachments?: MailAttachment[];
  /** Metadados livres para auditoria / provedor */
  headers?: Record<string, string>;
  tags?: string[];
}

export interface MailSendResult {
  success: boolean;
  /** ID retornado pelo provedor, quando houver */
  messageId?: string;
  provider: MailProviderName;
  /** true quando o envio foi apenas simulado (stub / dry-run) */
  simulated: boolean;
  error?: string;
}

export type MailTemplateId =
  | "new-device-access-request"
  | "access-code"
  | "contract-signed"
  | "contract-created"
  | "access-recovery"
  | "notification";

export interface RenderedMailTemplate {
  subject: string;
  html: string;
  text: string;
}

/** Payloads tipados por template */
export interface NewDeviceAccessRequestData {
  userName: string;
  deviceLabel: string;
  requestedAt: string;
  approveUrl?: string;
  ip?: string;
}

export interface AccessCodeData {
  userName: string;
  code: string;
  expiresInMinutes: number;
  contextLabel?: string;
}

export interface ContractSignedData {
  recipientName: string;
  contractTitle: string;
  contractNumber: string;
  signedAt: string;
  viewUrl?: string;
}

export interface ContractCreatedData {
  recipientName: string;
  contractTitle: string;
  contractNumber: string;
  createdAt: string;
  viewUrl?: string;
}

export interface AccessRecoveryData {
  userName: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export interface NotificationData {
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
}

export type MailTemplateDataMap = {
  "new-device-access-request": NewDeviceAccessRequestData;
  "access-code": AccessCodeData;
  "contract-signed": ContractSignedData;
  "contract-created": ContractCreatedData;
  "access-recovery": AccessRecoveryData;
  notification: NotificationData;
};

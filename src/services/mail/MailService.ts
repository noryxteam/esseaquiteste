import {
  getMailConfig,
  getMissingMailEnvKeys,
  isMailConfigured,
  MailConfigError,
} from "@/config/mail";
import { smtpMailProvider } from "./SmtpMailProvider";
import { renderMailTemplate } from "./MailTemplates";
import type {
  MailAddress,
  MailAttachment,
  MailMessage,
  MailSendResult,
  MailTemplateDataMap,
  MailTemplateId,
} from "./types";

function normalizeAddressList(
  value: MailMessage["to"] | undefined
): Array<string | MailAddress> {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function fail(
  error: string,
  provider: MailSendResult["provider"] = "smtp"
): MailSendResult {
  // eslint-disable-next-line no-console
  console.error(`✗ Falha ao enviar email. ${error}`);
  return {
    success: false,
    provider,
    simulated: false,
    error,
  };
}

/**
 * Ponto único de envio de e-mails da plataforma.
 * Usa Nodemailer + SMTP (Gmail) com uma única conexão reutilizável.
 *
 * Credenciais: apenas via .env (ver src/config/mail.ts).
 * Nenhuma rota ou envio automático é disparado por este módulo.
 */
export class MailService {
  /** Envio genérico (HTML, texto e anexos). */
  async send(message: MailMessage): Promise<MailSendResult> {
    const to = normalizeAddressList(message.to);
    if (to.length === 0) {
      return fail("Destinatário (to) é obrigatório.");
    }

    if (!message.subject?.trim()) {
      return fail("Assunto (subject) é obrigatório.");
    }

    if (!message.html?.trim() && !message.text?.trim()) {
      return fail("Informe html e/ou text.");
    }

    if (!isMailConfigured()) {
      const missing = getMissingMailEnvKeys().join(", ");
      return fail(
        `Configuração de e-mail incompleta. Variáveis ausentes no .env: ${missing}`
      );
    }

    try {
      // Garante validação tipada antes do envio (lança MailConfigError se inválido)
      getMailConfig();
    } catch (error) {
      if (error instanceof MailConfigError) {
        return fail(error.message);
      }
      throw error;
    }

    return smtpMailProvider.send(message);
  }

  /** Atalho para e-mail HTML (texto opcional como fallback). */
  async sendHtml(params: {
    to: MailMessage["to"];
    subject: string;
    html: string;
    text?: string;
    cc?: MailMessage["cc"];
    bcc?: MailMessage["bcc"];
    attachments?: MailAttachment[];
  }): Promise<MailSendResult> {
    return this.send({
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
    });
  }

  /** Atalho para e-mail em texto simples. */
  async sendText(params: {
    to: MailMessage["to"];
    subject: string;
    text: string;
    cc?: MailMessage["cc"];
    bcc?: MailMessage["bcc"];
    attachments?: MailAttachment[];
  }): Promise<MailSendResult> {
    return this.send({
      to: params.to,
      subject: params.subject,
      text: params.text,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
    });
  }

  /**
   * Envia um template tipado da plataforma.
   * Preferir este método para fluxos de produto (código, contrato, etc.).
   */
  async sendTemplate<T extends MailTemplateId>(params: {
    templateId: T;
    to: MailMessage["to"];
    data: MailTemplateDataMap[T];
    cc?: MailMessage["cc"];
    bcc?: MailMessage["bcc"];
    attachments?: MailAttachment[];
  }): Promise<MailSendResult> {
    const rendered = renderMailTemplate(params.templateId, params.data);
    return this.send({
      to: params.to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
      tags: [params.templateId],
    });
  }

  getProviderName() {
    return "smtp" as const;
  }

  isConfigured(): boolean {
    return isMailConfigured();
  }
}

/** Instância compartilhada — use sempre esta exportação nos callers. */
export const mailService = new MailService();

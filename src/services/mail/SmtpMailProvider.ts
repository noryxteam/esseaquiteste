import nodemailer from "nodemailer";
import type { SendMailOptions, Transporter } from "nodemailer";
import { getMailConfig, type MailConfig } from "@/config/mail";
import type { MailAddress, MailAttachment, MailMessage, MailSendResult } from "./types";
import type { MailProvider } from "./MailProvider";

function formatAddress(address: string | MailAddress): string {
  if (typeof address === "string") return address;
  if (address.name) return `"${address.name}" <${address.email}>`;
  return address.email;
}

function formatAddressList(
  value: string | string[] | MailAddress | MailAddress[] | undefined
): string | undefined {
  if (value == null) return undefined;
  const list = Array.isArray(value) ? value : [value];
  return list.map(formatAddress).join(", ");
}

function toRecipientLog(
  value: string | string[] | MailAddress | MailAddress[]
): string {
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((item) => (typeof item === "string" ? item : item.email))
    .join(", ");
}

function mapAttachments(
  attachments: MailAttachment[] | undefined
): SendMailOptions["attachments"] {
  if (!attachments?.length) return undefined;
  return attachments.map((file) => ({
    filename: file.filename,
    content: file.content,
    contentType: file.contentType,
    cid: file.cid,
  }));
}

/**
 * Provedor SMTP via Nodemailer (Gmail e outros).
 * Mantém uma única conexão reutilizável (pool).
 */
export class SmtpMailProvider implements MailProvider {
  readonly name = "smtp" as const;

  private transporter: Transporter | null = null;
  private transporterConfigKey: string | null = null;

  private configKey(config: MailConfig): string {
    return [config.host, config.port, config.secure, config.user].join("|");
  }

  private getTransporter(): Transporter {
    const config = getMailConfig();
    const key = this.configKey(config);

    if (this.transporter && this.transporterConfigKey === key) {
      return this.transporter;
    }

    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
    }

    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: Infinity,
    });
    this.transporterConfigKey = key;

    return this.transporter;
  }

  async send(message: MailMessage): Promise<MailSendResult> {
    const recipients = toRecipientLog(message.to);

    try {
      const config = getMailConfig();
      const transporter = this.getTransporter();

      const info = await transporter.sendMail({
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: formatAddressList(message.to),
        cc: formatAddressList(message.cc),
        bcc: formatAddressList(message.bcc),
        replyTo: message.replyTo
          ? formatAddress(message.replyTo)
          : undefined,
        subject: message.subject,
        text: message.text,
        html: message.html,
        attachments: mapAttachments(message.attachments),
        headers: message.headers,
      });

      // eslint-disable-next-line no-console
      console.info(`✓ Email enviado para ${recipients}`);

      return {
        success: true,
        messageId: info.messageId,
        provider: this.name,
        simulated: false,
      };
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Erro desconhecido ao enviar e-mail.";

      // eslint-disable-next-line no-console
      console.error(`✗ Falha ao enviar email. ${detail}`);

      return {
        success: false,
        provider: this.name,
        simulated: false,
        error: detail,
      };
    }
  }

  /** Encerra o pool SMTP (útil em shutdown / testes). */
  async close(): Promise<void> {
    if (!this.transporter) return;
    this.transporter.close();
    this.transporter = null;
    this.transporterConfigKey = null;
  }
}

/** Instância única do adaptador SMTP — reutilizada pelo MailService. */
export const smtpMailProvider = new SmtpMailProvider();

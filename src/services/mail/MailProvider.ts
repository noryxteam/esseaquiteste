import type { MailMessage, MailProviderName, MailSendResult } from "./types";

/**
 * Contrato que todo provedor de e-mail deve implementar.
 * Trocar SMTP ↔ Resend ↔ SendGrid ↔ SES ↔ Mailgun
 * exige alteração apenas na fábrica / implementação — não nos callers.
 */
export interface MailProvider {
  readonly name: MailProviderName;
  send(message: MailMessage): Promise<MailSendResult>;
}

/**
 * Provedor stub: útil quando o SMTP ainda não está configurado.
 * Não envia e-mail de verdade.
 */
export class StubMailProvider implements MailProvider {
  readonly name: MailProviderName = "stub";

  async send(message: MailMessage): Promise<MailSendResult> {
    const messageId = `stub_${Date.now().toString(36)}`;
    const to = Array.isArray(message.to) ? message.to : [message.to];
    const recipients = to
      .map((item) => (typeof item === "string" ? item : item.email))
      .join(", ");

    // eslint-disable-next-line no-console
    console.info(`✓ Email enviado para ${recipients} (simulado / stub)`);

    return {
      success: true,
      messageId,
      provider: this.name,
      simulated: true,
    };
  }
}

abstract class UnimplementedMailProvider implements MailProvider {
  abstract readonly name: MailProviderName;

  async send(_message: MailMessage): Promise<MailSendResult> {
    return {
      success: false,
      provider: this.name,
      simulated: true,
      error: `Provedor "${this.name}" ainda não implementado.`,
    };
  }
}

export class ResendMailProvider extends UnimplementedMailProvider {
  readonly name = "resend" as const;
}

export class SendGridMailProvider extends UnimplementedMailProvider {
  readonly name = "sendgrid" as const;
}

export class SesMailProvider extends UnimplementedMailProvider {
  readonly name = "ses" as const;
}

export class MailgunMailProvider extends UnimplementedMailProvider {
  readonly name = "mailgun" as const;
}

export { SmtpMailProvider, smtpMailProvider } from "./SmtpMailProvider";

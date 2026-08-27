import { env } from "@/config";
import nodemailer from "nodemailer";

export interface SendAccessCodeEmailInput {
  to: string;
  clientName: string;
  contractNumber: string;
  code: string;
  expiresAt: Date;
}

export interface SendDeviceAuthEmailInput {
  to: string;
  clientName: string;
  contractNumber: string;
  contractTitle?: string;
  deviceLabel: string;
  os?: string;
  browser?: string;
  location?: string;
  requestedAt: string;
  /** Página simples para escolher permissão e autorizar */
  authorizeUrl: string;
  denyUrl: string;
  ip?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;font-size:13px;color:#71717a;width:120px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-size:13px;color:#fafafa;font-weight:500;">${escapeHtml(value)}</td>
  </tr>`;
}

function buildDeviceAuthHtml(input: SendDeviceAuthEmailInput): string {
  const contractName = input.contractTitle
    ? `${input.contractNumber} — ${input.contractTitle}`
    : input.contractNumber;
  const rows = [
    detailRow("Nome do contrato", contractName),
    detailRow("Nome do dispositivo", input.deviceLabel || "—"),
    detailRow("Navegador", input.browser || "—"),
    detailRow("Sistema operacional", input.os || "—"),
    input.location ? detailRow("Localização", input.location) : "",
    input.ip ? detailRow("IP", input.ip) : "",
    detailRow("Data e hora", input.requestedAt),
  ]
    .filter(Boolean)
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;color:#fafafa;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:24px 28px;border-bottom:1px solid #222;">
          <p style="margin:0;font-size:14px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#fff;">Norax</p>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 8px;font-size:18px;color:#fff;">Novo dispositivo solicitando acesso</h1>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#a1a1aa;">
            Olá, ${escapeHtml(input.clientName)}. Um dispositivo pediu acesso ao seu contrato.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            ${rows}
          </table>
          <p style="margin:0;">
            <a href="${escapeHtml(input.authorizeUrl)}" style="display:inline-block;padding:12px 22px;background:#22c55e;color:#052e16;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:0 8px 8px 0;">✓ Autorizar</a>
            <a href="${escapeHtml(input.denyUrl)}" style="display:inline-block;padding:12px 22px;background:#ef4444;color:#fff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:0 0 8px 0;">✕ Negar</a>
          </p>
        </td></tr>
        <tr><td style="padding:16px 28px 24px;border-top:1px solid #222;">
          <p style="margin:0;font-size:11px;line-height:1.5;color:#71717a;">
            Em Autorizar você escolhe Visualizador ou Assinante. Negar bloqueia o acesso imediatamente.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export class EmailService {
  private getTransporter() {
    if (!env.MAIL_HOST || !env.MAIL_USER || !env.MAIL_PASSWORD) return null;
    return nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_SECURE,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASSWORD,
      },
    });
  }

  /** @returns true se o SMTP aceitou o envio */
  private async send(to: string, subject: string, text: string, html: string): Promise<boolean> {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.info("\n📧 [EMAIL SIMULADO — SMTP não configurado]");
      console.info(`Para: ${to}`);
      console.info(`Assunto: ${subject}`);
      console.info(text);
      console.info("");
      return false;
    }

    try {
      await transporter.sendMail({
        from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM_EMAIL}>`,
        to,
        subject,
        text,
        html,
      });
      return true;
    } catch (err) {
      console.error("[email] SMTP falhou (Gmail rejeitou login/senha):", err);
      console.info("\n📧 [EMAIL FALLBACK — SMTP falhou]");
      console.info(`Para: ${to}`);
      console.info(`Assunto: ${subject}`);
      console.info(text);
      console.info("");
      return false;
    }
  }

  async sendAccessCodeEmail(input: SendAccessCodeEmailInput): Promise<void> {
    const expiresFormatted = input.expiresAt.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    const text = [
      `Olá, ${input.clientName},`,
      "",
      `Um novo código de acesso foi gerado para o contrato ${input.contractNumber}.`,
      "",
      `Código: ${input.code}`,
      `Validade: ${expiresFormatted}`,
      "",
      "Este código pode ser utilizado apenas uma vez.",
      "Não compartilhe com pessoas não autorizadas.",
      "",
      "— Norax Agency OS",
    ].join("\n");

    await this.send(
      input.to,
      `Norax — Código de acesso ${input.contractNumber}`,
      text,
      `<pre style="font-family:Segoe UI,Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(text)}</pre>`
    );
  }

  async sendDeviceAuthorizationEmail(input: SendDeviceAuthEmailInput): Promise<boolean> {
    const text = [
      `Olá, ${input.clientName}.`,
      "",
      `Novo dispositivo solicitando acesso ao contrato ${input.contractNumber}.`,
      `Nome do contrato: ${input.contractTitle || input.contractNumber}`,
      `Nome do dispositivo: ${input.deviceLabel}`,
      `Navegador: ${input.browser || "—"}`,
      `Sistema operacional: ${input.os || "—"}`,
      input.location ? `Localização: ${input.location}` : null,
      input.ip ? `IP: ${input.ip}` : null,
      `Data e hora: ${input.requestedAt}`,
      "",
      `Autorizar: ${input.authorizeUrl}`,
      `Negar: ${input.denyUrl}`,
      "",
      "— Norax",
    ]
      .filter(Boolean)
      .join("\n");

    return this.send(
      input.to,
      `Norax — Dispositivo solicitando acesso ${input.contractNumber}`,
      text,
      buildDeviceAuthHtml(input)
    );
  }

  async sendFormInviteEmail(input: {
    to: string;
    subject: string;
    message: string;
    formUrl: string;
    ctaLabel?: string;
  }): Promise<boolean> {
    const text = [
      input.message.trim(),
      "",
      input.message.includes(input.formUrl) ? null : `Link: ${input.formUrl}`,
      "",
      "— Norax",
    ]
      .filter(Boolean)
      .join("\n");

    const cta = escapeHtml(input.ctaLabel?.trim() || "Abrir link");

    const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:24px;background:#0a0a0a;color:#fafafa;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;border:1px solid #222;border-radius:12px;background:#111;padding:28px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Norax</p>
    <pre style="margin:0 0 20px;white-space:pre-wrap;font-family:Segoe UI,Arial,sans-serif;font-size:14px;line-height:1.6;color:#d4d4d8;">${escapeHtml(input.message.trim())}</pre>
    <a href="${escapeHtml(input.formUrl)}" style="display:inline-block;padding:12px 20px;background:#fff;color:#0a0a0a;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;">${cta}</a>
  </div>
</body></html>`;

    return this.send(input.to, input.subject.trim() || "Norax", text, html);
  }
}

export const emailService = new EmailService();

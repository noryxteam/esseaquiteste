import type {
  AccessCodeData,
  AccessRecoveryData,
  ContractCreatedData,
  ContractSignedData,
  MailTemplateDataMap,
  MailTemplateId,
  NewDeviceAccessRequestData,
  NotificationData,
  RenderedMailTemplate,
} from "./types";

const BRAND = "Norax";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;color:#fafafa;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #222;">
              <p style="margin:0;font-size:14px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#fff;">${BRAND}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;border-top:1px solid #222;">
              <p style="margin:0;font-size:11px;line-height:1.5;color:#71717a;">
                Este e-mail foi enviado automaticamente pela plataforma ${BRAND}.
                Se você não reconhece esta mensagem, ignore-a.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, url: string): string {
  return `<p style="margin:24px 0 0;">
  <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 18px;background:#fafafa;color:#0a0a0a;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;">
    ${escapeHtml(label)}
  </a>
</p>`;
}

function newDeviceAccessRequest(
  data: NewDeviceAccessRequestData
): RenderedMailTemplate {
  const subject = `${BRAND} — Novo dispositivo solicitando acesso`;
  const text = [
    `Olá, ${data.userName}.`,
    "",
    "Um novo dispositivo solicitou acesso à sua conta.",
    `Dispositivo: ${data.deviceLabel}`,
    data.ip ? `IP: ${data.ip}` : null,
    `Solicitado em: ${data.requestedAt}`,
    data.approveUrl ? `Aprovar: ${data.approveUrl}` : null,
    "",
    `— ${BRAND}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:18px;color:#fff;">Novo dispositivo solicitando acesso</h1>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">Olá, ${escapeHtml(data.userName)}.</p>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">
      Um novo dispositivo pediu autorização para acessar sua conta.
    </p>
    <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.7;color:#d4d4d8;">
      <li>Dispositivo: <strong style="color:#fff;">${escapeHtml(data.deviceLabel)}</strong></li>
      ${data.ip ? `<li>IP: ${escapeHtml(data.ip)}</li>` : ""}
      <li>Solicitado em: ${escapeHtml(data.requestedAt)}</li>
    </ul>
    ${data.approveUrl ? ctaButton("Revisar solicitação", data.approveUrl) : ""}
  `
  );

  return { subject, html, text };
}

function accessCode(data: AccessCodeData): RenderedMailTemplate {
  const subject = `${BRAND} — Seu código de acesso`;
  const context = data.contextLabel ?? "acesso seguro";
  const text = [
    `Olá, ${data.userName}.`,
    "",
    `Seu código de ${context} é: ${data.code}`,
    `Válido por ${data.expiresInMinutes} minutos.`,
    "",
    "Não compartilhe este código com ninguém.",
    "",
    `— ${BRAND}`,
  ].join("\n");

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:18px;color:#fff;">Código de acesso</h1>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">Olá, ${escapeHtml(data.userName)}.</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#a1a1aa;">
      Use o código abaixo para ${escapeHtml(context)}. Ele expira em ${data.expiresInMinutes} minutos.
    </p>
    <p style="margin:0;padding:16px 20px;background:#0a0a0a;border:1px solid #333;border-radius:10px;font-size:28px;letter-spacing:0.28em;font-weight:700;color:#fff;text-align:center;">
      ${escapeHtml(data.code)}
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#71717a;">Não compartilhe este código com ninguém.</p>
  `
  );

  return { subject, html, text };
}

function contractSigned(data: ContractSignedData): RenderedMailTemplate {
  const subject = `${BRAND} — Contrato assinado: ${data.contractNumber}`;
  const text = [
    `Olá, ${data.recipientName}.`,
    "",
    `O contrato "${data.contractTitle}" (${data.contractNumber}) foi assinado.`,
    `Data: ${data.signedAt}`,
    data.viewUrl ? `Ver contrato: ${data.viewUrl}` : null,
    "",
    `— ${BRAND}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:18px;color:#fff;">Contrato assinado</h1>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">Olá, ${escapeHtml(data.recipientName)}.</p>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">
      O contrato <strong style="color:#fff;">${escapeHtml(data.contractTitle)}</strong>
      (<span style="font-family:ui-monospace,monospace;">${escapeHtml(data.contractNumber)}</span>)
      foi assinado em ${escapeHtml(data.signedAt)}.
    </p>
    ${data.viewUrl ? ctaButton("Abrir contrato", data.viewUrl) : ""}
  `
  );

  return { subject, html, text };
}

function contractCreated(data: ContractCreatedData): RenderedMailTemplate {
  const subject = `${BRAND} — Novo contrato: ${data.contractNumber}`;
  const text = [
    `Olá, ${data.recipientName}.`,
    "",
    `Um novo contrato foi criado: "${data.contractTitle}" (${data.contractNumber}).`,
    `Criado em: ${data.createdAt}`,
    data.viewUrl ? `Ver contrato: ${data.viewUrl}` : null,
    "",
    `— ${BRAND}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:18px;color:#fff;">Contrato criado</h1>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">Olá, ${escapeHtml(data.recipientName)}.</p>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">
      O contrato <strong style="color:#fff;">${escapeHtml(data.contractTitle)}</strong>
      (<span style="font-family:ui-monospace,monospace;">${escapeHtml(data.contractNumber)}</span>)
      foi criado em ${escapeHtml(data.createdAt)}.
    </p>
    ${data.viewUrl ? ctaButton("Ver contrato", data.viewUrl) : ""}
  `
  );

  return { subject, html, text };
}

function accessRecovery(data: AccessRecoveryData): RenderedMailTemplate {
  const subject = `${BRAND} — Recuperação de acesso`;
  const text = [
    `Olá, ${data.userName}.`,
    "",
    "Recebemos um pedido para recuperar o acesso à sua conta.",
    `Abra o link a seguir (válido por ${data.expiresInMinutes} minutos):`,
    data.resetUrl,
    "",
    "Se você não solicitou isso, ignore este e-mail.",
    "",
    `— ${BRAND}`,
  ].join("\n");

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:18px;color:#fff;">Recuperação de acesso</h1>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">Olá, ${escapeHtml(data.userName)}.</p>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#a1a1aa;">
      Use o botão abaixo para redefinir o acesso. O link expira em ${data.expiresInMinutes} minutos.
    </p>
    ${ctaButton("Recuperar acesso", data.resetUrl)}
    <p style="margin:16px 0 0;font-size:12px;color:#71717a;">Se você não solicitou isso, ignore este e-mail.</p>
  `
  );

  return { subject, html, text };
}

function notification(data: NotificationData): RenderedMailTemplate {
  const subject = `${BRAND} — ${data.title}`;
  const text = [
    data.title,
    "",
    data.message,
    data.actionUrl ? `${data.actionLabel ?? "Abrir"}: ${data.actionUrl}` : null,
    "",
    `— ${BRAND}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = layout(
    subject,
    `
    <h1 style="margin:0 0 12px;font-size:18px;color:#fff;">${escapeHtml(data.title)}</h1>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#a1a1aa;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
    ${
      data.actionUrl
        ? ctaButton(data.actionLabel ?? "Abrir", data.actionUrl)
        : ""
    }
  `
  );

  return { subject, html, text };
}

type TemplateRenderer<T extends MailTemplateId> = (
  data: MailTemplateDataMap[T]
) => RenderedMailTemplate;

const renderers: { [K in MailTemplateId]: TemplateRenderer<K> } = {
  "new-device-access-request": newDeviceAccessRequest,
  "access-code": accessCode,
  "contract-signed": contractSigned,
  "contract-created": contractCreated,
  "access-recovery": accessRecovery,
  notification,
};

/** Renderiza um template tipado (HTML + texto + assunto). */
export function renderMailTemplate<T extends MailTemplateId>(
  templateId: T,
  data: MailTemplateDataMap[T]
): RenderedMailTemplate {
  const renderer = renderers[templateId] as TemplateRenderer<T>;
  return renderer(data);
}

export const MailTemplates = {
  render: renderMailTemplate,
  ids: Object.keys(renderers) as MailTemplateId[],
};

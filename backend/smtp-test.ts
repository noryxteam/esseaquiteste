/**
 * Teste isolado de SMTP (Gmail).
 * Uso: npx tsx smtp-test.ts  (a partir de backend/)
 * Não altera o sistema — só lê backend/.env e testa Nodemailer.
 */
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const envPath = path.resolve(__dirname, ".env");
const loaded = dotenv.config({ path: envPath });

if (loaded.error) {
  console.error("Falha ao carregar .env:", loaded.error.message);
  console.error("Caminho esperado:", envPath);
  process.exit(1);
}

const host = process.env.MAIL_HOST ?? "";
const port = Number(process.env.MAIL_PORT ?? 587);
const secureRaw = process.env.MAIL_SECURE ?? "false";
const secure = secureRaw === "true" || secureRaw === "1";
const user = process.env.MAIL_USER ?? "";
const password = process.env.MAIL_PASSWORD ?? "";
const fromName = process.env.MAIL_FROM_NAME ?? "Norax SMTP Test";
const fromEmail = process.env.MAIL_FROM_EMAIL || user;

console.log("=== SMTP TEST (isolado) ===");
console.log("env file:", envPath);
console.log("host:", host || "(vazio)");
console.log("porta:", port);
console.log("secure:", secure, `(raw: ${JSON.stringify(secureRaw)})`);
console.log("usuário:", user || "(vazio)");
console.log("tamanho da senha:", password.length, "(senha não exibida)");
console.log("");

if (!host || !user || !password) {
  console.error("MAIL_HOST, MAIL_USER ou MAIL_PASSWORD ausentes. Abortando.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass: password },
});

async function main() {
  console.log("--- transporter.verify() ---");
  try {
    await transporter.verify();
    console.log("resultado verify(): OK");
  } catch (err) {
    console.log("resultado verify(): FALHOU");
    dumpError(err);
    console.log("");
    console.log("--- sendMail() ---");
    console.log("resultado sendMail(): IGNORADO (verify falhou)");
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log("--- sendMail() ---");
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: user,
      subject: "[Norax] SMTP test",
      text: "E-mail de teste isolado do smtp-test.ts. Se você recebeu isto, a autenticação SMTP está OK.",
    });
    console.log("resultado sendMail(): OK");
    console.log("messageId:", info.messageId);
    console.log("response:", info.response);
  } catch (err) {
    console.log("resultado sendMail(): FALHOU");
    dumpError(err);
    process.exitCode = 1;
  }
}

function dumpError(err: unknown) {
  if (!(err instanceof Error)) {
    console.error("erro (raw):", err);
    return;
  }
  const anyErr = err as Error & {
    code?: string;
    responseCode?: number;
    response?: string;
    command?: string;
  };
  console.error("erro.message:", anyErr.message);
  console.error("erro.name:", anyErr.name);
  console.error("erro.code:", anyErr.code);
  console.error("erro.responseCode:", anyErr.responseCode);
  console.error("erro.response:", anyErr.response);
  console.error("erro.command:", anyErr.command);
  console.error("erro.stack:");
  console.error(anyErr.stack);
}

main().catch((err) => {
  console.error("Falha inesperada:");
  dumpError(err);
  process.exit(1);
});

/** Máscaras de entrada: usuário digita só dígitos; pontuação entra sozinha. */

export function onlyDigits(value: string, max?: number): string {
  const digits = value.replace(/\D/g, "");
  return typeof max === "number" ? digits.slice(0, max) : digits;
}

export type DocumentKind = "cpf" | "cnpj" | null;

export function detectDocumentKind(value: string): DocumentKind {
  const digits = onlyDigits(value);
  if (digits.length === 0) return null;
  if (digits.length <= 11) return "cpf";
  return "cnpj";
}

/** CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00) — máx. 14 dígitos. */
export function formatCpfCnpj(value: string): string {
  const d = onlyDigits(value, 14);

  if (d.length <= 11) {
    const p1 = d.slice(0, 3);
    const p2 = d.slice(3, 6);
    const p3 = d.slice(6, 9);
    const p4 = d.slice(9, 11);
    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `-${p4}`;
    return out;
  }

  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 8);
  const p4 = d.slice(8, 12);
  const p5 = d.slice(12, 14);
  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `/${p4}`;
  if (p5) out += `-${p5}`;
  return out;
}

/** CPF (11) ou CNPJ (14) completo — só dígitos. */
export function isCompleteCpfCnpj(value: string): boolean {
  const d = onlyDigits(value);
  return d.length === 11 || d.length === 14;
}

export function documentLabel(value: string): string {
  const kind = detectDocumentKind(value);
  if (kind === "cnpj") return "CNPJ";
  if (kind === "cpf") return "CPF";
  return "CPF ou CNPJ";
}

/** Telefone BR: (00) 0000-0000 ou (00) 00000-0000 */
export function formatPhoneBr(value: string): string {
  const d = onlyDigits(value, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Valor em reais a partir de dígitos (centavos implícitos).
 * Ex.: digitar 3300 → "33,00" e valor numérico 33.
 */
export function formatMoneyInput(value: string): { display: string; amount: number } {
  const d = onlyDigits(value, 12);
  if (!d) return { display: "", amount: 0 };
  const cents = Number.parseInt(d, 10);
  const amount = cents / 100;
  const display = amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return { display, amount };
}

export function moneyDigitsFromAmount(amount: number): string {
  if (!amount || amount <= 0) return "";
  return String(Math.round(amount * 100));
}

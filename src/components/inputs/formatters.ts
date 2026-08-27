/** Strip all non-digit characters from a string. */
export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Format CPF: 000.000.000-00 */
export function formatCPF(value: string): string {
  const digits = stripNonDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/** Format CNPJ: 00.000.000/0000-00 */
export function formatCNPJ(value: string): string {
  const digits = stripNonDigits(value).slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

/** Format Brazilian phone: (00) 00000-0000 or (00) 0000-0000 */
export function formatPhone(value: string): string {
  const digits = stripNonDigits(value).slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Format currency input from cent digits (e.g. "12345" → "R$ 123,45"). */
export function formatCurrencyInput(value: string): string {
  const digits = stripNonDigits(value);
  const cents = Number.parseInt(digits || "0", 10);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/** Parse currency input string to number in BRL. */
export function parseCurrencyInput(value: string): number {
  const digits = stripNonDigits(value);
  return Number.parseInt(digits || "0", 10) / 100;
}

/** Format date input: dd/mm/yyyy */
export function formatDateInput(value: string): string {
  const digits = stripNonDigits(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Format number with Brazilian locale (allows decimal comma). */
export function formatNumberInput(value: string): string {
  const cleaned = value.replace(/[^\d,.-]/g, "");
  const parts = cleaned.split(",");
  const integerPart = stripNonDigits(parts[0] ?? "");
  const decimalPart = parts[1]?.replace(/\D/g, "").slice(0, 2);

  if (!integerPart && !decimalPart) return "";

  const formattedInteger = integerPart
    ? new Intl.NumberFormat("pt-BR").format(Number.parseInt(integerPart, 10))
    : "0";

  if (decimalPart !== undefined && parts.length > 1) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
}

/** Parse formatted number input to float. */
export function parseNumberInput(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Helpers do visualizador premium de contratos. */

export function formatRelativeFromBrDate(dateStr: string): string {
  if (!dateStr || dateStr === "—") return "—";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [dd, mm, yyyy] = parts.map(Number);
  const then = new Date(yyyy, mm - 1, dd);
  if (Number.isNaN(then.getTime())) return dateStr;

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThen = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const days = Math.round((startToday.getTime() - startThen.getTime()) / 86_400_000);

  if (days <= 0) return "Hoje";
  if (days === 1) return "Há 1 dia";
  if (days < 30) return `Há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months === 1) return "Há 1 mês";
  if (months < 12) return `Há ${months} meses`;
  return dateStr;
}

export function getSignedAtLabel(data: {
  signatures: { status: string; date?: string; time?: string }[];
  lastValidation: string;
}): string {
  const signed = data.signatures.filter((s) => s.status === "assinado" && s.date);
  if (signed.length === 0) return "—";
  const last = signed[signed.length - 1];
  if (last.date && last.time) return `${last.date} às ${last.time}`;
  return last.date ?? data.lastValidation ?? "—";
}

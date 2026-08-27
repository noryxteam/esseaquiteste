import type { TimelineStep } from "@/modules/project-workspace/types";

/** Progresso do projeto = etapas concluídas / total (0–100). */
export function computeProjectProgress(steps: TimelineStep[]): number {
  if (steps.length === 0) return 0;
  const done = steps.filter((s) => s.status === "completed").length;
  return Math.round((done / steps.length) * 100);
}

export function stepCompletionRatio(step: TimelineStep): number {
  return step.status === "completed" ? 1 : 0;
}

export function formatDateBR(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatTimeBR(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatDateTimeBR(iso: string): string {
  return `${formatDateBR(iso)} · ${formatTimeBR(iso)}`;
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

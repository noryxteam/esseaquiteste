import type { FixedTimelineKey } from "@/modules/project-workspace/fixed-timeline";

export interface ProgressSuggestionRange {
  min: number;
  max: number;
  /** Valor sugerido ao concluir a etapa (se o progresso atual estiver abaixo do mínimo). */
  suggested: number;
}

/** Faixas sugeridas — coerência entre timeline e progresso, sem travar o slider. */
export const PROGRESS_SUGGESTIONS: Record<FixedTimelineKey, ProgressSuggestionRange> = {
  "projeto-iniciado": { min: 5, max: 10, suggested: 8 },
  "briefing-recebido": { min: 10, max: 20, suggested: 15 },
  "contrato-assinado": { min: 20, max: 30, suggested: 25 },
  desenvolvimento: { min: 30, max: 80, suggested: 45 },
  revisao: { min: 80, max: 90, suggested: 85 },
  publicacao: { min: 90, max: 95, suggested: 92 },
  "entrega-final": { min: 100, max: 100, suggested: 100 },
};

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/**
 * Se o progresso atual estiver abaixo da faixa da etapa concluída,
 * sobe para o valor sugerido. Nunca reduz um progresso já maior.
 */
export function applyProgressSuggestion(
  currentProgress: number,
  fixedKey: FixedTimelineKey | null | undefined
): { progress: number; applied: boolean; range: ProgressSuggestionRange | null } {
  if (!fixedKey) {
    return { progress: clampProgress(currentProgress), applied: false, range: null };
  }
  const range = PROGRESS_SUGGESTIONS[fixedKey];
  if (!range) {
    return { progress: clampProgress(currentProgress), applied: false, range: null };
  }
  const current = clampProgress(currentProgress);
  if (current < range.min) {
    return { progress: range.suggested, applied: true, range };
  }
  return { progress: current, applied: false, range };
}

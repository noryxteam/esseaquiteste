"use client";

import { useEffect, useMemo } from "react";
import {
  BRIEFING_AUTO_ADVANCE_MS,
  getBriefingAutoAdvanceRemainingMs,
} from "@/modules/project-workspace/fixed-timeline";
import { autoCompleteBriefingIfDue } from "@/modules/project-workspace/store";
import type { TimelineStep } from "@/modules/project-workspace/types";

/**
 * Auto-avança Briefing após ~10 min em "verificando".
 * Admin concluindo antes no painel cancela o timer naturalmente.
 */
export function useBriefingAutoAdvance(projectId: string, steps: TimelineStep[]) {
  const briefing = steps.find((s) => s.fixedKey === "briefing-recebido");
  const watchKey = useMemo(
    () => `${briefing?.id ?? ""}:${briefing?.status ?? ""}:${briefing?.activatedAt ?? ""}`,
    [briefing?.id, briefing?.status, briefing?.activatedAt]
  );

  useEffect(() => {
    const remaining = getBriefingAutoAdvanceRemainingMs(steps);
    if (remaining === null) return;

    const delay = remaining === 0 ? 80 : remaining;
    const t = window.setTimeout(() => {
      autoCompleteBriefingIfDue(projectId, "Sistema");
    }, Math.min(delay, BRIEFING_AUTO_ADVANCE_MS + 1000));

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- watchKey captura o estado relevante
  }, [projectId, watchKey]);
}

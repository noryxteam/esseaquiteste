import type { TimelineStep } from "@/modules/project-workspace/types";
import { uid } from "@/modules/project-workspace/utils";

export type FixedTimelineKey =
  | "projeto-iniciado"
  | "briefing-recebido"
  | "contrato-assinado"
  | "desenvolvimento"
  | "revisao"
  | "publicacao"
  | "entrega-final";

export interface FixedTimelineDefinition {
  key: FixedTimelineKey;
  name: string;
  icon: string;
  defaultDescription: string;
}

/** Timeline oficial Norax — obrigatória em todos os projetos. */
export const FIXED_TIMELINE: FixedTimelineDefinition[] = [
  {
    key: "projeto-iniciado",
    name: "Projeto iniciado",
    icon: "Flag",
    defaultDescription: "iniciado",
  },
  {
    key: "briefing-recebido",
    name: "Briefing recebido",
    icon: "ClipboardList",
    defaultDescription: "verificado",
  },
  {
    key: "contrato-assinado",
    name: "Contrato assinado",
    icon: "FileCheck",
    defaultDescription: "assinado",
  },
  {
    key: "desenvolvimento",
    name: "Desenvolvimento",
    icon: "Code2",
    defaultDescription: "em andamento",
  },
  {
    key: "revisao",
    name: "Revisão",
    icon: "Search",
    defaultDescription: "em revisão",
  },
  {
    key: "publicacao",
    name: "Publicação",
    icon: "Rocket",
    defaultDescription: "publicado",
  },
  {
    key: "entrega-final",
    name: "Entrega final",
    icon: "Trophy",
    defaultDescription: "entregue",
  },
];

function nowIso(): string {
  return new Date().toISOString();
}

export function createFixedTimelineSteps(opts?: {
  autoCompleteFirst?: boolean;
  userName?: string;
}): TimelineStep[] {
  const createdAt = nowIso();
  const userName = opts?.userName ?? "Sistema";

  const steps = FIXED_TIMELINE.map((def, index) => {
    const autoFirst = Boolean(opts?.autoCompleteFirst) && index === 0;
    return {
      id: uid(`fixed-${def.key}`),
      fixedKey: def.key,
      name: def.name,
      status: autoFirst ? ("completed" as const) : ("pending" as const),
      description: autoFirst ? def.defaultDescription : "",
      notes: "",
      category: "sistema" as const,
      libraryId: def.key,
      createdAt,
      completedAt: autoFirst ? createdAt : null,
      completedByName: autoFirst ? userName : null,
      responsibleName: null,
      checklist: [],
      visibleToClient: true,
      activatedAt: null as string | null,
    };
  });

  return syncFixedInProgress(steps);
}

/** Garante um único `in_progress` — a próxima etapa após a última concluída. */
export function syncFixedInProgress(steps: TimelineStep[]): TimelineStep[] {
  const firstOpen = steps.findIndex((s) => s.status !== "completed");
  const now = nowIso();
  return steps.map((step, index) => {
    if (step.status === "completed") {
      if (step.activatedAt == null) return step;
      return { ...step, activatedAt: null };
    }

    const nextStatus = index === firstOpen ? ("in_progress" as const) : ("pending" as const);
    const stamped =
      nextStatus === "in_progress" ? step.activatedAt ?? now : null;

    if (step.status === nextStatus && step.activatedAt === stamped) return step;
    return { ...step, status: nextStatus, activatedAt: stamped };
  });
}

/** Briefing fica "verificando" e após este tempo auto-conclui → próximo. */
export const BRIEFING_AUTO_ADVANCE_MS = 10 * 60 * 1000;

export function getBriefingAutoAdvanceRemainingMs(steps: TimelineStep[]): number | null {
  const briefing = steps.find((s) => s.fixedKey === "briefing-recebido");
  if (!briefing || briefing.status === "completed") return null;
  if (briefing.status !== "in_progress") return null;
  const since = briefing.activatedAt ? Date.parse(briefing.activatedAt) : Date.now();
  const elapsed = Date.now() - since;
  return Math.max(0, BRIEFING_AUTO_ADVANCE_MS - elapsed);
}

export function isFixedTimeline(steps: TimelineStep[]): boolean {
  if (steps.length !== FIXED_TIMELINE.length) return false;
  return FIXED_TIMELINE.every((def, i) => steps[i]?.fixedKey === def.key);
}

/** Migra timeline antiga para a estrutura fixa, preservando dados por nome/chave quando possível. */
export function migrateToFixedTimeline(steps: TimelineStep[]): TimelineStep[] {
  if (isFixedTimeline(steps)) return steps;

  const fresh = createFixedTimelineSteps({ autoCompleteFirst: false });
  const byKey = new Map(steps.filter((s) => s.fixedKey).map((s) => [s.fixedKey!, s]));
  const byName = new Map(steps.map((s) => [s.name.toLowerCase(), s]));

  const merged = fresh.map((base) => {
    const defKey = base.fixedKey!;
    const prev =
      byKey.get(defKey) ||
      byName.get(base.name.toLowerCase()) ||
      undefined;

    if (!prev) return base;

    return {
      ...base,
      id: prev.fixedKey === defKey ? prev.id : base.id,
      status: prev.status === "completed" ? ("completed" as const) : ("pending" as const),
      description: prev.description || "",
      notes: prev.notes || "",
      completedAt: prev.status === "completed" ? prev.completedAt : null,
      completedByName: prev.status === "completed" ? prev.completedByName : null,
      createdAt: prev.createdAt || base.createdAt,
      visibleToClient: true,
      fixedKey: defKey,
      activatedAt: prev.activatedAt ?? null,
      name: base.name,
    };
  });

  return syncFixedInProgress(merged);
}

export function getFixedStepIndex(steps: TimelineStep[], stepId: string): number {
  return steps.findIndex((s) => s.id === stepId);
}

/** Só pode concluir se todas as anteriores estiverem concluídas. */
export function canCompleteFixedStep(steps: TimelineStep[], stepId: string): {
  ok: boolean;
  message?: string;
} {
  const idx = getFixedStepIndex(steps, stepId);
  if (idx < 0) return { ok: false, message: "Etapa não encontrada." };
  if (steps[idx].status === "completed") {
    return { ok: true };
  }
  for (let i = 0; i < idx; i++) {
    if (steps[i].status !== "completed") {
      return {
        ok: false,
        message: "Conclua primeiro a etapa anterior para continuar o fluxo do projeto.",
      };
    }
  }
  return { ok: true };
}

export function getFixedVisualStatus(
  steps: TimelineStep[],
  index: number
): "pending" | "active" | "completed" {
  const step = steps[index];
  if (!step) return "pending";
  if (step.status === "completed") return "completed";
  const firstPending = steps.findIndex((s) => s.status !== "completed");
  if (index === firstPending) return "active";
  return "pending";
}

export function getFixedDefinition(key: FixedTimelineKey): FixedTimelineDefinition {
  return FIXED_TIMELINE.find((d) => d.key === key)!;
}

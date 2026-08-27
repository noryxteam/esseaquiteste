import type { FixedTimelineKey } from "@/modules/project-workspace/fixed-timeline";
import type { TimelineStep } from "@/modules/project-workspace/types";
import { formatDateBR, formatTimeBR } from "@/modules/project-workspace/utils";

export type TimelineVisualStatus = "pending" | "active" | "completed";

export interface TimelineStepCopy {
  /** Título exibido no card */
  title: string;
  /** Linha sob o título (data ou status curto) */
  subline: string;
  /** Texto central curto — único por etapa */
  center: string;
  /** Badge à direita */
  badge: string;
  /** Destaque verde no badge (entrega) */
  badgeAccent?: "success";
}

type CopyDef = {
  title: string;
  pendingCenter: string;
  activeCenter: string;
  completedCenter: string;
  pendingBadge: string;
  activeBadge: string;
  completedBadge: string;
  activeSubline?: string;
  pendingSubline?: string;
  badgeAccentCompleted?: "success";
};

const COPY: Record<FixedTimelineKey, CopyDef> = {
  "projeto-iniciado": {
    title: "Projeto iniciado",
    pendingCenter: "—",
    activeCenter: "iniciando",
    completedCenter: "iniciado",
    pendingBadge: "Pendente",
    activeBadge: "Iniciando",
    completedBadge: "Iniciado",
  },
  "briefing-recebido": {
    title: "Briefing recebido",
    pendingCenter: "—",
    activeCenter: "verificando",
    completedCenter: "verificado",
    pendingBadge: "Pendente",
    activeBadge: "Verificando",
    completedBadge: "Verificado",
    activeSubline: "Verificando",
  },
  "contrato-assinado": {
    title: "Contrato assinado",
    pendingCenter: "no aguardo",
    activeCenter: "no aguardo",
    completedCenter: "assinado",
    pendingBadge: "No aguardo",
    activeBadge: "No aguardo",
    completedBadge: "Assinado",
    pendingSubline: "No aguardo",
    activeSubline: "No aguardo",
  },
  desenvolvimento: {
    title: "Desenvolvimento",
    pendingCenter: "—",
    activeCenter: "em andamento",
    completedCenter: "concluído",
    pendingBadge: "Pendente",
    activeBadge: "Em andamento",
    completedBadge: "Concluído",
    activeSubline: "Em andamento",
  },
  revisao: {
    title: "Revisão",
    pendingCenter: "—",
    activeCenter: "em revisão",
    completedCenter: "revisado",
    pendingBadge: "Pendente",
    activeBadge: "Em revisão",
    completedBadge: "Revisado",
    activeSubline: "Em revisão",
  },
  publicacao: {
    title: "Publicação",
    pendingCenter: "publicado",
    activeCenter: "publicando",
    completedCenter: "publicado",
    pendingBadge: "Pendente",
    activeBadge: "Publicando",
    completedBadge: "Publicado",
    pendingSubline: "publicado",
    activeSubline: "Publicando",
  },
  "entrega-final": {
    title: "Entrega final",
    pendingCenter: "—",
    activeCenter: "finalizando",
    completedCenter: "entregue",
    pendingBadge: "Pendente",
    activeBadge: "Finalizando",
    completedBadge: "Entregue",
    badgeAccentCompleted: "success",
  },
};

export function getTimelineStepCopy(
  step: TimelineStep,
  visual: TimelineVisualStatus,
  fixedKey?: FixedTimelineKey | null
): TimelineStepCopy {
  const key = (fixedKey ?? step.fixedKey) as FixedTimelineKey | null;
  const def = key ? COPY[key] : null;

  if (!def) {
    return {
      title: step.name,
      subline:
        step.completedAt
          ? `${formatDateBR(step.completedAt)} às ${formatTimeBR(step.completedAt)}`
          : visual === "active"
            ? "Em andamento"
            : "Aguardando",
      center: step.description || "—",
      badge:
        visual === "completed" ? "Concluído" : visual === "active" ? "Em andamento" : "Pendente",
    };
  }

  const center =
    visual === "completed"
      ? def.completedCenter
      : visual === "active"
        ? def.activeCenter
        : def.pendingCenter;

  const badge =
    visual === "completed"
      ? def.completedBadge
      : visual === "active"
        ? def.activeBadge
        : def.pendingBadge;

  let subline: string;
  if (step.completedAt && visual === "completed") {
    subline = `${formatDateBR(step.completedAt)} às ${formatTimeBR(step.completedAt)}`;
  } else if (visual === "active") {
    subline = def.activeSubline ?? def.activeCenter;
  } else {
    subline = def.pendingSubline ?? "Aguardando";
  }

  // Admin pode ter preenchido descrição curta — prioriza se for curta e diferente do default longo
  const custom = step.description?.trim();
  const useCustom =
    Boolean(custom) &&
    custom.length <= 40 &&
    visual === "completed" &&
    key !== "entrega-final";

  return {
    title: def.title,
    subline,
    center: useCustom ? custom! : center,
    badge,
    badgeAccent: visual === "completed" ? def.badgeAccentCompleted : undefined,
  };
}

/** Texto padrão ao auto-concluir etapa (descrição persistida). */
export function getCompletedCenterLabel(fixedKey: FixedTimelineKey): string {
  return COPY[fixedKey].completedCenter;
}

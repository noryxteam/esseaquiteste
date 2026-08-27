import type { LibraryStage, StageCategory, TimelineStep } from "@/modules/project-workspace/types";
import { getLibraryStage } from "@/modules/project-workspace/library/stage-library";
import { uid } from "@/modules/project-workspace/utils";

function nowIso(): string {
  return new Date().toISOString();
}

/** Normaliza etapas antigas do localStorage para o schema atual. */
export function normalizeTimelineStep(raw: Partial<TimelineStep> & { name: string; id: string }): TimelineStep {
  const legacy = raw as Partial<TimelineStep> & { clientVisible?: boolean };
  return {
    id: raw.id,
    name: raw.name,
    status:
      raw.status === "completed"
        ? "completed"
        : raw.status === "in_progress"
          ? "in_progress"
          : "pending",
    description: raw.description ?? "",
    notes: raw.notes ?? "",
    category: (raw.category as StageCategory) || "personalizadas",
    fixedKey: (raw.fixedKey as TimelineStep["fixedKey"]) ?? null,
    libraryId: raw.libraryId ?? null,
    createdAt: raw.createdAt ?? nowIso(),
    completedAt: raw.completedAt ?? null,
    completedByName: raw.completedByName ?? null,
    responsibleName: raw.responsibleName ?? null,
    checklist: Array.isArray(raw.checklist) ? raw.checklist : [],
    visibleToClient: raw.visibleToClient ?? legacy.clientVisible ?? false,
    activatedAt: raw.activatedAt ?? null,
  };
}

export function createStepFromName(
  name: string,
  opts?: Partial<Pick<TimelineStep, "category" | "description" | "libraryId" | "visibleToClient" | "fixedKey">>
): TimelineStep {
  return {
    id: uid("step"),
    name: name.trim(),
    status: "pending",
    description: opts?.description ?? "",
    notes: "",
    category: opts?.category ?? "personalizadas",
    fixedKey: opts?.fixedKey ?? null,
    libraryId: opts?.libraryId ?? null,
    createdAt: nowIso(),
    completedAt: null,
    completedByName: null,
    responsibleName: null,
    checklist: [],
    visibleToClient: opts?.visibleToClient ?? false,
    activatedAt: null,
  };
}

export function createStepFromLibrary(stage: LibraryStage): TimelineStep {
  return createStepFromName(stage.name, {
    category: stage.category,
    description: stage.description ?? "",
    libraryId: stage.id,
    visibleToClient: false,
  });
}

export function createStepsFromLibraryIds(ids: string[]): TimelineStep[] {
  return ids
    .map((id) => getLibraryStage(id))
    .filter((s): s is LibraryStage => Boolean(s))
    .map(createStepFromLibrary);
}

export function duplicateTimelineStep(step: TimelineStep): TimelineStep {
  return {
    ...step,
    id: uid("step"),
    name: `${step.name} (cópia)`,
    status: "pending",
    createdAt: nowIso(),
    completedAt: null,
    completedByName: null,
    activatedAt: null,
    checklist: step.checklist.map((c) => ({ ...c, id: uid("chk"), done: false })),
  };
}

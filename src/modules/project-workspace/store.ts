import type { Project } from "@/lib/mock-data/projetos-types";
import { projetosData } from "@/lib/mock-data/projetos";
import type {
  ProjectBlock,
  ProjectBlockKind,
  ProjectFileItem,
  ProjectHistoryEntry,
  ProjectWorkspaceState,
  TimelineStep,
} from "@/modules/project-workspace/types";
import { BLOCK_KIND_LABELS, INTERNAL_BLOCK_KINDS } from "@/modules/project-workspace/types";
import {
  normalizeTimelineStep,
} from "@/modules/project-workspace/services/timeline-steps";
import {
  canCompleteFixedStep,
  createFixedTimelineSteps,
  FIXED_TIMELINE,
  getBriefingAutoAdvanceRemainingMs,
  isFixedTimeline,
  migrateToFixedTimeline,
  syncFixedInProgress,
} from "@/modules/project-workspace/fixed-timeline";
import { emitTimelineRealtime } from "@/modules/project-workspace/realtime";
import {
  applyProgressSuggestion,
  clampProgress,
} from "@/modules/project-workspace/progress-suggestions";
import { getCompletedCenterLabel } from "@/modules/project-workspace/timeline-copy";
import { uid } from "@/modules/project-workspace/utils";

const STORAGE_KEY = "norax.project-workspace.v1";

type StoreMap = Record<string, ProjectWorkspaceState>;

let cache: StoreMap | null = null;
let storeVersion = 0;
const listeners = new Set<() => void>();

function readAll(): StoreMap {
  if (cache) return cache;
  if (typeof window === "undefined") {
    cache = {};
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as StoreMap) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function persistSilent(map: StoreMap): void {
  cache = map;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch {
      // quota
    }
  }
}

function writeAll(map: StoreMap, projectId?: string): void {
  persistSilent(map);
  storeVersion += 1;
  listeners.forEach((l) => l());
  if (projectId) {
    const state = map[projectId];
    if (state) {
      emitTimelineRealtime({
        type: state.finalizedAt ? "project.finalized" : "timeline.updated",
        projectId,
        at: nowIso(),
        progress: state.progress,
      });
    }
  }
}

export function subscribeProjectWorkspace(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Versão estável para useSyncExternalStore (número primitivo). */
export function getProjectWorkspaceStoreVersion(): number {
  readAll();
  return storeVersion;
}

function nowIso(): string {
  return new Date().toISOString();
}

function pushHistory(
  state: ProjectWorkspaceState,
  userName: string,
  action: string,
  meta?: Partial<
    Pick<ProjectHistoryEntry, "stepId" | "stepName" | "previousStatus" | "newStatus">
  >
): ProjectHistoryEntry[] {
  return [
    {
      id: uid("hist"),
      at: nowIso(),
      userName,
      action,
      ...meta,
    },
    ...state.history,
  ].slice(0, 200);
}

function statusLabelPT(status: string): string {
  if (status === "completed") return "Concluído";
  if (status === "in_progress") return "Em andamento";
  return "Pendente";
}

/**
 * Progresso é MANUAL (slider admin) — independente da timeline.
 * Só sincroniza rótulos quando o projeto está finalizado.
 */
function syncProgress(state: ProjectWorkspaceState): ProjectWorkspaceState {
  const progress = clampProgress(state.progress);

  if (state.finalizedAt) {
    if (
      progress === 100 &&
      state.statusLabel === "Finalizado" &&
      state.category === "concluido"
    ) {
      return progress === state.progress ? state : { ...state, progress };
    }
    return { ...state, progress: 100, statusLabel: "Finalizado", category: "concluido" };
  }

  if (progress === state.progress) return state;
  return { ...state, progress };
}

function emptyWorkspace(projectId: string, project?: Project): ProjectWorkspaceState {
  const createdAt = nowIso();
  const steps = createFixedTimelineSteps({ autoCompleteFirst: true, userName: "Sistema" });
  return {
    projectId,
    steps,
    blocks: [],
    files: [],
    history: [
      {
        id: uid("hist"),
        at: createdAt,
        userName: "Sistema",
        action: "Projeto criado — timeline oficial iniciada",
      },
    ],
    createdAt,
    finalizedAt: null,
    // Projeto iniciado auto → faixa 5–10%
    progress: 8,
    statusLabel: project?.stageLabel ?? "Em andamento",
    category: project?.category === "concluido" ? "concluido" : "em-andamento",
  };
}

export function getBaseProject(projectId: string): Project | undefined {
  return projetosData.projects.find((p) => p.id === projectId);
}

export function getProjectWorkspace(projectId: string): ProjectWorkspaceState {
  const all = readAll();
  const existing = all[projectId];
  if (existing) {
    const normalized = existing.steps.map((s) => normalizeTimelineStep(s));
    const baseFixed = isFixedTimeline(normalized)
      ? syncFixedInProgress(normalized)
      : migrateToFixedTimeline(normalized);

    // Mantém títulos oficiais sempre sincronizados
    const fixed = baseFixed.map((s, i) => {
      const official = FIXED_TIMELINE[i]?.name;
      if (official && s.name !== official) return { ...s, name: official };
      return s;
    });

    const needsPersist =
      !isFixedTimeline(existing.steps) ||
      fixed.some(
        (s, i) =>
          s.status !== existing.steps[i]?.status ||
          s.fixedKey !== existing.steps[i]?.fixedKey ||
          s.name !== existing.steps[i]?.name ||
          s.activatedAt !== existing.steps[i]?.activatedAt
      );

    if (!needsPersist) {
      return existing;
    }

    const migrated = syncProgress({ ...existing, steps: fixed });
    all[projectId] = migrated;
    persistSilent(all);
    return migrated;
  }

  const fresh = emptyWorkspace(projectId, getBaseProject(projectId));
  all[projectId] = fresh;
  persistSilent(all);
  return fresh;
}

function update(
  projectId: string,
  userName: string,
  mutator: (state: ProjectWorkspaceState) => ProjectWorkspaceState,
  historyAction?: string,
  historyMeta?: Partial<
    Pick<ProjectHistoryEntry, "stepId" | "stepName" | "previousStatus" | "newStatus">
  >
): ProjectWorkspaceState {
  const all = readAll();
  const current = all[projectId] ?? emptyWorkspace(projectId, getBaseProject(projectId));
  let next = mutator({
    ...current,
    steps: [...current.steps],
    blocks: [...current.blocks],
    files: [...current.files],
    history: [...current.history],
  });
  if (historyAction) {
    next = { ...next, history: pushHistory(next, userName, historyAction, historyMeta) };
  }
  next = {
    ...next,
    steps: isFixedTimeline(next.steps) ? syncFixedInProgress(next.steps) : next.steps,
  };
  next = syncProgress(next);
  all[projectId] = next;
  writeAll(all, projectId);
  return next;
}

export function applyTemplate(
  projectId: string,
  _templateId: string,
  userName: string
): ProjectWorkspaceState {
  // Timeline oficial é sempre a mesma — templates não alteram a estrutura.
  return update(
    projectId,
    userName,
    (state) => ({
      ...state,
      steps: createFixedTimelineSteps({ autoCompleteFirst: true, userName }),
      finalizedAt: null,
    }),
    "Timeline oficial Norax reaplicada"
  );
}

export function addTimelineStep(
  projectId: string,
  _name: string,
  _userName: string
): ProjectWorkspaceState {
  // Timeline oficial é fixa — não permite etapas extras.
  return getProjectWorkspace(projectId);
}

export function addLibrarySteps(
  projectId: string,
  _libraryIds: string[],
  _userName: string
): ProjectWorkspaceState {
  // Timeline oficial é fixa — biblioteca não altera a estrutura.
  return getProjectWorkspace(projectId);
}

export function renameTimelineStep(
  projectId: string,
  _stepId: string,
  _name: string,
  _userName: string
): ProjectWorkspaceState {
  // Nomes oficiais da timeline são imutáveis.
  return getProjectWorkspace(projectId);
}

export function updateTimelineStep(
  projectId: string,
  stepId: string,
  patch: Partial<
    Pick<
      TimelineStep,
      | "name"
      | "description"
      | "notes"
      | "category"
      | "responsibleName"
      | "status"
      | "visibleToClient"
    >
  >,
  userName: string
): ProjectWorkspaceState {
  const state = getProjectWorkspace(projectId);
  if (isFixedTimeline(state.steps) && patch.status === "completed") {
    const gate = canCompleteFixedStep(state.steps, stepId);
    if (!gate.ok) return state;
  }

  // Não permite renomear etapas oficiais.
  const safePatch = isFixedTimeline(state.steps)
    ? { ...patch, name: undefined }
    : patch;

  return update(
    projectId,
    userName,
    (s) => ({
      ...s,
      steps: s.steps.map((step) => {
        if (step.id !== stepId) return step;
        const next = { ...step, ...safePatch };
        if (safePatch.status === "completed" && step.status !== "completed") {
          next.completedAt = nowIso();
          next.completedByName = userName;
        }
        if (safePatch.status === "pending" || safePatch.status === "in_progress") {
          next.completedAt = null;
          next.completedByName = null;
        }
        return next;
      }),
    }),
    "Etapa atualizada"
  );
}

export function duplicateTimelineStep(
  projectId: string,
  _stepId: string,
  _userName: string
): ProjectWorkspaceState {
  return getProjectWorkspace(projectId);
}

export function deleteTimelineStep(
  projectId: string,
  _stepId: string,
  _userName: string
): ProjectWorkspaceState {
  return getProjectWorkspace(projectId);
}

export function moveTimelineStep(
  projectId: string,
  _stepId: string,
  _direction: "up" | "down",
  _userName: string
): ProjectWorkspaceState {
  return getProjectWorkspace(projectId);
}

export function reorderTimelineSteps(
  projectId: string,
  _orderedIds: string[],
  _userName: string
): ProjectWorkspaceState {
  return getProjectWorkspace(projectId);
}

export function completeTimelineStep(
  projectId: string,
  stepId: string,
  userName: string
): ProjectWorkspaceState {
  const state = getProjectWorkspace(projectId);
  const gate = canCompleteFixedStep(state.steps, stepId);
  if (!gate.ok) return state;
  const step = state.steps.find((s) => s.id === stepId);
  if (!step || step.status === "completed") return state;

  return update(
    projectId,
    userName,
    (s) => ({
      ...s,
      steps: s.steps.map((x) =>
        x.id === stepId
          ? {
              ...x,
              status: "completed" as const,
              completedAt: nowIso(),
              completedByName: userName,
              checklist: x.checklist.map((c) => ({ ...c, done: true })),
            }
          : x
      ),
    }),
    `Etapa concluída: ${step.name}`
  );
}

export interface FixedStepFormPayload {
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  description: string;
  notes: string;
}

/**
 * Define o progresso geral (0–100). Independente da timeline.
 * Persistido automaticamente — usado pelo slider admin.
 */
export function setProjectProgress(
  projectId: string,
  value: number,
  userName: string
): ProjectWorkspaceState {
  const progress = clampProgress(value);
  const current = getProjectWorkspace(projectId);
  if (current.progress === progress) return current;

  const next = update(
    projectId,
    userName,
    (state) => ({ ...state, progress }),
    `Progresso atualizado: ${current.progress}% → ${progress}%`
  );

  emitTimelineRealtime({
    type: "project.progress",
    projectId,
    at: nowIso(),
    progress: next.progress,
  });

  return next;
}

/**
 * Briefing: após ~10 min em "verificando", marca "verificado" e avança sozinho.
 * Se o admin concluir antes no painel, este tick não faz nada.
 */
export function autoCompleteBriefingIfDue(
  projectId: string,
  userName = "Sistema"
): ProjectWorkspaceState | null {
  const state = getProjectWorkspace(projectId);
  const remaining = getBriefingAutoAdvanceRemainingMs(state.steps);
  if (remaining === null || remaining > 0) return null;

  const briefing = state.steps.find((s) => s.fixedKey === "briefing-recebido");
  if (!briefing || briefing.status === "completed") return null;

  const gate = canCompleteFixedStep(state.steps, briefing.id);
  if (!gate.ok) return null;

  const suggestion = applyProgressSuggestion(state.progress, "briefing-recebido");
  const label = getCompletedCenterLabel("briefing-recebido");

  return update(
    projectId,
    userName,
    (s) => ({
      ...s,
      progress: suggestion.progress,
      steps: s.steps.map((x) =>
        x.id === briefing.id
          ? {
              ...x,
              status: "completed" as const,
              description: label,
              completedAt: nowIso(),
              completedByName: userName,
              activatedAt: null,
            }
          : x
      ),
    }),
    `Etapa "Briefing recebido": Verificando → Verificado (auto)`
  );
}

export function saveFixedStepCompletion(
  projectId: string,
  stepId: string,
  payload: FixedStepFormPayload,
  userName: string
): {
  ok: true;
  state: ProjectWorkspaceState;
  progressSuggestion?: { applied: boolean; min: number; max: number; progress: number };
} | { ok: false; message: string } {
  const state = getProjectWorkspace(projectId);
  const gate = canCompleteFixedStep(state.steps, stepId);
  if (!gate.ok) {
    return {
      ok: false,
      message: gate.message ?? "Conclua primeiro a etapa anterior para continuar o fluxo do projeto.",
    };
  }

  const step = state.steps.find((s) => s.id === stepId);
  if (!step) return { ok: false, message: "Etapa não encontrada." };

  const iso = `${payload.date}T${payload.time || "12:00"}:00`;
  const completedAt = Number.isNaN(Date.parse(iso)) ? nowIso() : new Date(iso).toISOString();
  const prevStatus = step.status;
  const wasCompleted = prevStatus === "completed";
  const action = wasCompleted
    ? `Etapa "${step.name}" atualizada`
    : `Etapa "${step.name}": ${statusLabelPT(prevStatus)} → Concluído`;

  const suggestion = wasCompleted
    ? { progress: state.progress, applied: false, range: null as null }
    : applyProgressSuggestion(state.progress, step.fixedKey);

  const next = update(
    projectId,
    userName,
    (s) => ({
      ...s,
      progress: suggestion.progress,
      steps: s.steps.map((x) =>
        x.id === stepId
          ? {
              ...x,
              status: "completed" as const,
              description: payload.description.trim(),
              notes: payload.notes.trim(),
              completedAt,
              completedByName: userName,
            }
          : x
      ),
    }),
    suggestion.applied
      ? `${action} · Progresso → ${suggestion.progress}%`
      : action,
    {
      stepId: step.id,
      stepName: step.name,
      previousStatus: prevStatus,
      newStatus: "completed",
    }
  );

  // Última etapa → finalizar projeto
  const allDone = next.steps.every((s) => s.status === "completed");
  if (allDone && !next.finalizedAt) {
    return {
      ok: true,
      state: finalizeProject(projectId, userName),
      progressSuggestion: {
        applied: true,
        min: 100,
        max: 100,
        progress: 100,
      },
    };
  }

  return {
    ok: true,
    state: next,
    progressSuggestion: suggestion.range
      ? {
          applied: suggestion.applied,
          min: suggestion.range.min,
          max: suggestion.range.max,
          progress: suggestion.progress,
        }
      : undefined,
  };
}

export function reopenTimelineStep(
  projectId: string,
  stepId: string,
  userName: string
): ProjectWorkspaceState {
  const state = getProjectWorkspace(projectId);
  const step = state.steps.find((s) => s.id === stepId);
  if (!step) return state;
  return update(
    projectId,
    userName,
    (s) => ({
      ...s,
      steps: s.steps.map((x) =>
        x.id === stepId
          ? {
              ...x,
              status: "pending" as const,
              completedAt: null,
              completedByName: null,
            }
          : x
      ),
      finalizedAt: null,
    }),
    `Etapa reaberta: ${step.name}`
  );
}

export function addChecklistItem(
  projectId: string,
  stepId: string,
  label: string,
  userName: string
): ProjectWorkspaceState {
  const trimmed = label.trim();
  if (!trimmed) return getProjectWorkspace(projectId);
  return update(
    projectId,
    userName,
    (state) => ({
      ...state,
      steps: state.steps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              checklist: [...s.checklist, { id: uid("chk"), label: trimmed, done: false }],
              status: "pending" as const,
            }
          : s
      ),
    }),
    `Item de checklist adicionado: ${trimmed}`
  );
}

export function toggleChecklistItem(
  projectId: string,
  stepId: string,
  itemId: string,
  userName: string
): ProjectWorkspaceState {
  const before = getProjectWorkspace(projectId);
  const step = before.steps.find((s) => s.id === stepId);
  const item = step?.checklist.find((c) => c.id === itemId);
  const willDone = item ? !item.done : false;

  return update(
    projectId,
    userName,
    (state) => {
      const steps = state.steps.map((s) => {
        if (s.id !== stepId) return s;
        const checklist = s.checklist.map((c) =>
          c.id === itemId ? { ...c, done: !c.done } : c
        );
        const allDone = checklist.length > 0 && checklist.every((c) => c.done);
        return {
          ...s,
          checklist,
          status: (allDone ? "completed" : "pending") as TimelineStep["status"],
          completedAt: allDone ? nowIso() : null,
          completedByName: allDone ? userName : null,
        };
      });
      return { ...state, steps };
    },
    item
      ? willDone
        ? `Checklist concluído: ${item.label}`
        : `Checklist desmarcado: ${item.label}`
      : undefined
  );
}

export function removeChecklistItem(
  projectId: string,
  stepId: string,
  itemId: string,
  userName: string
): ProjectWorkspaceState {
  return update(
    projectId,
    userName,
    (state) => ({
      ...state,
      steps: state.steps.map((s) =>
        s.id === stepId
          ? { ...s, checklist: s.checklist.filter((c) => c.id !== itemId) }
          : s
      ),
    }),
    "Item de checklist removido"
  );
}

export function addBlock(
  projectId: string,
  kind: ProjectBlockKind,
  userName: string
): ProjectWorkspaceState {
  const title = BLOCK_KIND_LABELS[kind];
  const block: ProjectBlock = {
    id: uid("block"),
    kind,
    title,
    body: "",
    internalOnly: INTERNAL_BLOCK_KINDS.includes(kind),
  };
  return update(
    projectId,
    userName,
    (state) => ({ ...state, blocks: [...state.blocks, block] }),
    `Bloco adicionado: ${title}`
  );
}

export function updateBlockBody(
  projectId: string,
  blockId: string,
  body: string,
  userName: string
): ProjectWorkspaceState {
  return update(projectId, userName, (state) => ({
    ...state,
    blocks: state.blocks.map((b) => (b.id === blockId ? { ...b, body } : b)),
  }));
}

export function removeBlock(
  projectId: string,
  blockId: string,
  userName: string
): ProjectWorkspaceState {
  const state = getProjectWorkspace(projectId);
  const block = state.blocks.find((b) => b.id === blockId);
  return update(
    projectId,
    userName,
    (s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== blockId) }),
    block ? `Bloco removido: ${block.title}` : undefined
  );
}

export function addProjectFile(
  projectId: string,
  file: Omit<ProjectFileItem, "id">,
  userName: string
): ProjectWorkspaceState {
  const item: ProjectFileItem = { ...file, id: uid("file") };
  return update(
    projectId,
    userName,
    (state) => ({ ...state, files: [item, ...state.files] }),
    `Arquivo enviado: ${file.name}`
  );
}

export function removeProjectFile(
  projectId: string,
  fileId: string,
  userName: string
): ProjectWorkspaceState {
  const state = getProjectWorkspace(projectId);
  const file = state.files.find((f) => f.id === fileId);
  return update(
    projectId,
    userName,
    (s) => ({ ...s, files: s.files.filter((f) => f.id !== fileId) }),
    file ? `Arquivo excluído: ${file.name}` : undefined
  );
}

export function finalizeProject(
  projectId: string,
  userName: string
): ProjectWorkspaceState {
  return update(
    projectId,
    userName,
    (state) => ({
      ...state,
      finalizedAt: nowIso(),
      progress: 100,
      statusLabel: "Finalizado",
      category: "concluido",
      steps: state.steps.map((s) =>
        s.status === "completed"
          ? s
          : {
              ...s,
              status: "completed" as const,
              completedAt: s.completedAt ?? nowIso(),
              completedByName: s.completedByName ?? userName,
              checklist: s.checklist.map((c) => ({ ...c, done: true })),
            }
      ),
    }),
    "Projeto finalizado"
  );
}

/** Merge workspace overrides into list view projects */
export function applyWorkspaceOverrides(projects: Project[]): Project[] {
  const all = readAll();
  return projects.map((p) => {
    const ws = all[p.id];
    if (!ws) return p;
    return {
      ...p,
      progress: ws.progress,
      category: ws.category,
      stageLabel: ws.statusLabel,
      completedDate: ws.finalizedAt
        ? new Intl.DateTimeFormat("pt-BR").format(new Date(ws.finalizedAt))
        : p.completedDate,
      stage: ws.category === "concluido" ? "qa" : p.stage,
    };
  });
}

export function getMergedProject(projectId: string): Project | undefined {
  const base = getBaseProject(projectId);
  if (!base) return undefined;
  return applyWorkspaceOverrides([base])[0];
}

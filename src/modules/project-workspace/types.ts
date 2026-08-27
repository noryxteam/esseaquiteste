export type TimelineStepStatus = "pending" | "in_progress" | "completed";

export type StageCategory =
  | "todos"
  | "desenvolvimento"
  | "design"
  | "financeiro"
  | "marketing"
  | "comercial"
  | "infraestrutura"
  | "entrega"
  | "sistema"
  | "personalizadas";

export type FixedTimelineKey =
  | "projeto-iniciado"
  | "briefing-recebido"
  | "contrato-assinado"
  | "desenvolvimento"
  | "revisao"
  | "publicacao"
  | "entrega-final";

export interface TimelineChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface TimelineStep {
  id: string;
  name: string;
  status: TimelineStepStatus;
  description: string;
  notes: string;
  category: StageCategory;
  /** Chave da timeline oficial Norax (estrutura fixa). */
  fixedKey: FixedTimelineKey | null;
  /** ID da biblioteca, se veio dela */
  libraryId: string | null;
  createdAt: string;
  completedAt: string | null;
  completedByName: string | null;
  responsibleName: string | null;
  checklist: TimelineChecklistItem[];
  /**
   * Preparado para o Portal do Cliente.
   */
  visibleToClient: boolean;
  /** Quando a etapa entrou em andamento (auto-avanço do briefing). */
  activatedAt: string | null;
}

export type ProjectBlockKind =
  | "cronograma"
  | "checklist"
  | "notas"
  | "arquivos"
  | "links"
  | "financeiro"
  | "hospedagem"
  | "dominio"
  | "credenciais"
  | "api"
  | "servidor"
  | "banco"
  | "integracoes"
  | "alteracoes"
  | "feedback"
  | "horas";

export interface ProjectBlock {
  id: string;
  kind: ProjectBlockKind;
  title: string;
  body: string;
  internalOnly: boolean;
}

export interface ProjectFileItem {
  id: string;
  name: string;
  mime: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  dataUrl?: string;
  internalOnly: boolean;
}

export interface ProjectHistoryEntry {
  id: string;
  at: string;
  userName: string;
  action: string;
  /** Metadados para auditoria (apenas admin). */
  stepId?: string;
  stepName?: string;
  previousStatus?: TimelineStepStatus | string;
  newStatus?: TimelineStepStatus | string;
}

export interface ProjectWorkspaceState {
  projectId: string;
  steps: TimelineStep[];
  blocks: ProjectBlock[];
  files: ProjectFileItem[];
  history: ProjectHistoryEntry[];
  createdAt: string;
  finalizedAt: string | null;
  progress: number;
  statusLabel: string;
  category: "em-andamento" | "planejamento" | "concluido";
}

export interface ProjectTemplate {
  id: string;
  name: string;
  /** IDs da biblioteca de etapas */
  libraryIds: string[];
}

export interface LibraryStage {
  id: string;
  name: string;
  category: Exclude<StageCategory, "todos">;
  icon: string;
  description?: string;
}

export const STAGE_CATEGORY_LABELS: Record<StageCategory, string> = {
  todos: "Todos",
  desenvolvimento: "Desenvolvimento",
  design: "Design",
  financeiro: "Financeiro",
  marketing: "Marketing",
  comercial: "Comercial",
  infraestrutura: "Infraestrutura",
  entrega: "Entrega",
  sistema: "Sistema",
  personalizadas: "Personalizadas",
};

export const BLOCK_KIND_LABELS: Record<ProjectBlockKind, string> = {
  cronograma: "Cronograma",
  checklist: "Checklist",
  notas: "Notas",
  arquivos: "Arquivos",
  links: "Links",
  financeiro: "Financeiro",
  hospedagem: "Hospedagem",
  dominio: "Domínio",
  credenciais: "Credenciais",
  api: "API",
  servidor: "Servidor",
  banco: "Banco de Dados",
  integracoes: "Integrações",
  alteracoes: "Alterações",
  feedback: "Feedback",
  horas: "Horas trabalhadas",
};

export const INTERNAL_BLOCK_KINDS: ProjectBlockKind[] = [
  "financeiro",
  "credenciais",
  "notas",
  "api",
  "servidor",
  "banco",
];

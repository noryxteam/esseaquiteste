/** Formulários por cliente — arquitetura preparada para expansão (lógica, assinatura, versões, modelos). */

export type FormStatus = "draft" | "sent" | "answered" | "archived";

export type FormBlockType =
  | "title"
  | "text"
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "select"
  | "date"
  | "number"
  | "upload"
  | "divider"
  | "section"
  | "info"
  | "spacer";

export interface FormOption {
  id: string;
  label: string;
}

export interface FormBlock {
  id: string;
  type: FormBlockType;
  /** Pergunta / título — começa vazio */
  label: string;
  /** Conteúdo auxiliar (texto informativo, etc.) */
  content: string;
  options: FormOption[];
  /** Futuro: obrigatoriedade */
  required: boolean;
  /**
   * Marca o campo como "novo" na atualização do formulário já enviado.
   * No link do cliente aparece destacado; se false, parece que sempre esteve lá.
   */
  isNewField?: boolean;
  /** Futuro: lógica condicional, validação, etc. */
  settings: Record<string, unknown>;
}

export interface ClientForm {
  id: string;
  clientId: string;
  title: string;
  status: FormStatus;
  /** Slug público único → /forms/[slug] */
  slug: string;
  blocks: FormBlock[];
  /** Futuro: versionamento */
  version: number;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  /** Futuro: templateId, signatureEnabled, etc. */
  meta: Record<string, unknown>;
}

export type FormAnswerValue = string | string[] | number | boolean | null;

export interface FormResponse {
  id: string;
  formId: string;
  clientId: string;
  /** blockId → valor */
  answers: Record<string, FormAnswerValue>;
  submittedAt: string;
  /** Futuro: reviewedAt, reviewedBy */
  reviewed: boolean;
  meta: Record<string, unknown>;
}

export const FORM_STATUS_LABELS: Record<FormStatus, string> = {
  draft: "Rascunho",
  sent: "Enviado",
  answered: "Respondido",
  archived: "Arquivado",
};

export interface BlockPaletteItem {
  type: FormBlockType;
  label: string;
}

/** Componentes estruturais — nenhum texto pré-preenchido no bloco criado. */
export const BLOCK_PALETTE: BlockPaletteItem[] = [
  { type: "title", label: "Título" },
  { type: "section", label: "Pergunta com campo" },
  { type: "text", label: "Texto" },
  { type: "info", label: "Texto informativo" },
  { type: "short_text", label: "Texto curto" },
  { type: "long_text", label: "Texto longo" },
  { type: "multiple_choice", label: "Múltipla escolha" },
  { type: "checkbox", label: "Caixa de seleção" },
  { type: "select", label: "Lista suspensa" },
  { type: "date", label: "Data" },
  { type: "number", label: "Número" },
  { type: "upload", label: "Upload de arquivos" },
  { type: "divider", label: "Divisor" },
  { type: "spacer", label: "Espaçamento" },
];

export function isAnswerBlock(type: FormBlockType): boolean {
  return (
    type === "section" ||
    type === "short_text" ||
    type === "long_text" ||
    type === "multiple_choice" ||
    type === "checkbox" ||
    type === "select" ||
    type === "date" ||
    type === "number" ||
    type === "upload"
  );
}

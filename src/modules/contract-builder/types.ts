export interface ClauseBlock {
  id: string;
  titulo: string;
  paragrafos: string[];
  /** Ordem 0-based; numeração exibida = ordem + 1 */
  ordem: number;
}

export type ContractTemplateKind =
  | "site_institucional"
  | "landing_page"
  | "sistema_web"
  | "aplicativo"
  | "loja_virtual"
  | "identidade_visual"
  | "hospedagem"
  | "manutencao"
  | "consultoria";

export interface ContractTemplateDef {
  kind: ContractTemplateKind;
  nome: string;
  descricao: string;
  clausulas: Omit<ClauseBlock, "id" | "ordem">[];
}

export interface ContractPageLayout {
  pageNumber: number;
  blockIds: string[];
}

/** Altura aproximada em unidades tipográficas para paginação A4.
 * Valores calibrados para caber várias cláusulas por página sem cortar nenhuma. */
export const PAGE_CONTENT_UNITS = 48;
/** Espaço da capa (título + resumo) na 1ª página */
export const COVER_OVERHEAD_UNITS = 14;
export const BLOCK_BASE_UNITS = 3;
export const PARAGRAPH_UNITS = 2;

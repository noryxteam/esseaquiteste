export type FileCategory =
  | "contrato"
  | "briefing"
  | "design"
  | "documento"
  | "imagem"
  | "video"
  | "planilha"
  | "outro";

export interface MockFile {
  id: string;
  clienteId: string;
  projetoId: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  criadoEm: string;
  categoria: FileCategory;
}

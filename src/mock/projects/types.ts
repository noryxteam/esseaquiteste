export type ProjectStatus =
  | "planejamento"
  | "em-andamento"
  | "pausado"
  | "concluido"
  | "cancelado";

export type ProjectPriority = "baixa" | "media" | "alta" | "urgente";

export interface MockProject {
  id: string;
  clienteId: string;
  nome: string;
  descricao: string;
  status: ProjectStatus;
  progresso: number;
  responsavelId: string;
  responsavel: string;
  dataInicio: string;
  prazo: string;
  prioridade: ProjectPriority;
  valor: number;
  briefingId: string | null;
  contratoId: string | null;
}

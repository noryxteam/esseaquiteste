export type TaskStatus = "pendente" | "em-andamento" | "concluida" | "cancelada";
export type TaskPriority = "baixa" | "media" | "alta" | "urgente";

export interface MockTask {
  id: string;
  projetoId: string;
  clienteId: string;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  responsavelId: string;
  responsavel: string;
  prioridade: TaskPriority;
  prazo: string;
  concluidoEm: string | null;
}

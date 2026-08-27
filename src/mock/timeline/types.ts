export type TimelineEventType =
  | "cliente-criado"
  | "projeto-iniciado"
  | "projeto-aprovado"
  | "projeto-concluido"
  | "contrato-enviado"
  | "contrato-assinado"
  | "pagamento-recebido"
  | "pagamento-pendente"
  | "reuniao-realizada"
  | "arquivo-enviado"
  | "briefing-criado"
  | "tarefa-concluida";

export interface MockTimelineEvent {
  id: string;
  tipo: TimelineEventType;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  clienteId: string | null;
  projetoId: string | null;
  contratoId: string | null;
  reuniaoId: string | null;
  arquivoId: string | null;
  usuarioId: string | null;
}

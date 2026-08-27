export type ContractStatus =
  | "rascunho"
  | "aguardando-assinatura"
  | "assinado"
  | "finalizado"
  | "cancelado"
  | "expirado";

export interface MockContract {
  id: string;
  clienteId: string;
  projetoId: string;
  numeroContrato: string;
  valor: number;
  status: ContractStatus;
  dataCriacao: string;
  dataAssinatura: string | null;
  formaPagamento: string;
  parcelas: number;
  assinado: boolean;
  link: string;
  token: string;
  hashDocumento: string;
}

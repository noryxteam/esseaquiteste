export type FinanceType = "receita" | "despesa" | "transferencia";
export type FinanceCategory = "receita" | "despesa" | "transferencia";
export type FinanceStatus = "pendente" | "pago" | "atrasado" | "cancelado";

export interface MockFinanceMovement {
  id: string;
  clienteId: string;
  contratoId: string | null;
  tipo: FinanceType;
  categoria: FinanceCategory;
  valor: number;
  status: FinanceStatus;
  data: string;
  formaPagamento: string;
  descricao: string;
}

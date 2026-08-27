export type FinancialTab = "todas" | "receitas" | "despesas" | "transferencias";

export type FinancialMovementType =
  | "recebimento"
  | "pagamento"
  | "a-receber"
  | "reembolso"
  | "transferencia";

export type FinancialCategory = "receita" | "despesa" | "transferencia";

export type PaymentMethod = "PIX" | "Boleto" | "Cartão" | "Transferência";

export type FinancialStatus = "recebido" | "pendente" | "pago" | "parcial" | "atrasado";

export interface FinancialStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  iconTone: "blue" | "green" | "yellow" | "red" | "neutral";
  subtitle: string;
  subtitleDirection: "up" | "down" | "neutral";
}

export interface FinancialFlowSegment {
  id: string;
  label: string;
  value: number;
  valueFormatted: string;
  color: string;
}

export interface FinancialMovement {
  id: string;
  contratoId: string;
  contratoNumero: string;
  cliente: string;
  projeto: string;
  descricao: string;
  categoria: FinancialCategory;
  tipo: FinancialMovementType;
  formaPagamento: PaymentMethod;
  valor: number;
  valorFormatted: string;
  status: FinancialStatus;
  statusLabel: string;
  data: string;
  hora: string;
  observacoes?: string;
}

export interface CashSummaryItem {
  id: string;
  label: string;
  value: string;
  tone?: "green" | "yellow" | "red" | "neutral";
}

export interface UpcomingPayment {
  id: string;
  day: string;
  month: string;
  cliente: string;
  contratoNumero: string;
  valor: string;
  formaPagamento: PaymentMethod;
}

export interface RevenueDistributionItem {
  id: string;
  label: string;
  percentage: number;
}

export interface RelatedContract {
  id: string;
  contratoId: string;
  numero: string;
  cliente: string;
  valor: string;
  percentualRecebido: number;
  status: "recebido" | "pendente" | "parcial";
  statusLabel: string;
}

export interface FinanceiroData {
  stats: FinancialStat[];
  flow: FinancialFlowSegment[];
  movements: FinancialMovement[];
  cashSummary: CashSummaryItem[];
  upcomingPayments: UpcomingPayment[];
  revenueDistribution: RevenueDistributionItem[];
  relatedContracts: RelatedContract[];
}

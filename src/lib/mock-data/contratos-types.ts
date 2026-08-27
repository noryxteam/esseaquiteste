export type ContractTab =
  | "todos"
  | "rascunhos"
  | "aguardando-assinatura"
  | "assinados"
  | "finalizados"
  | "cancelados"
  | "arquivados";

export type ContractStatus =
  | "rascunho"
  | "aguardando-assinatura"
  | "enviado"
  | "assinado"
  | "finalizado"
  | "cancelado"
  | "arquivado"
  | "expirado";

export type TrendDirection = "up" | "down" | "neutral" | "warning";

export interface ContractStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  subtitleDirection?: TrendDirection;
}

export interface ContractResponsible {
  initials: string;
  name: string;
}

export interface Contract {
  id: string;
  number: string;
  title: string;
  type: string;
  client: string;
  company: string;
  document: string;
  status: ContractStatus;
  statusLabel: string;
  value: number;
  valueFormatted: string;
  responsible: ContractResponsible;
  createdBy: ContractResponsible;
  createdAt: string;
  sentAt?: string;
  signedAt?: string;
  updatedAt: string;
  phone: string;
  email: string;
  signaturesCount: number;
  signaturesTotal: number;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ContratosData {
  stats: ContractStat[];
  contracts: Contract[];
  templates: ContractTemplate[];
}

export type ClientStatus = "lead" | "ativo" | "inativo" | "perdido";
export type NegotiationStatus =
  | "aberta"
  | "descoberta"
  | "proposta_enviada"
  | "em_negociacao"
  | "aguardando_contrato"
  | "aguardando_pagamento"
  | "ganha"
  | "perdida"
  | "arquivada";

export type ProjectStatus =
  | "planejamento"
  | "em_andamento"
  | "em_revisao"
  | "aguardando_cliente"
  | "aprovado"
  | "entregue"
  | "em_garantia"
  | "concluido"
  | "arquivado";

export type BlockType = "nenhum" | "cliente" | "interno";
export type ActionPriority = "urgente" | "atencao" | "informativo";
export type TimelineFilter = "todos" | "comercial" | "projetos" | "financeiro";

export interface TimelineEvent {
  id: string;
  text: string;
  timestamp: string;
  relative: string;
  category: "comercial" | "projetos" | "financeiro" | "cliente";
  link?: string;
}

export interface Action {
  id: string;
  title: string;
  context: string;
  due: string;
  priority: ActionPriority;
  module: string;
  link: string;
  completed?: boolean;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: ClientStatus;
  origin?: string;
  notes: string;
  nextStep: string;
  nextStepCta: string;
  nextStepLink: string;
  activeProjects: number;
  activeNegotiationId?: string;
  openValue: number;
  isEmpty?: boolean;
}

export interface Scope {
  objective: string;
  deliverables: string[];
  exclusions: string[];
  estimatedDeadline: string;
  internalValue: number;
}

export interface Proposal {
  version: number;
  status: "rascunho" | "enviada" | "aprovada" | "recusada";
  sentAt?: string;
  value: number;
}

export interface Contract {
  status: "pendente" | "enviado" | "assinado";
  sentAt?: string;
  signedAt?: string;
}

export interface Payment {
  id: string;
  label: string;
  amount: number;
  status: "pago" | "pendente" | "atrasado";
  dueDate?: string;
  paidAt?: string;
}

export interface Interaction {
  id: string;
  type: string;
  summary: string;
  date: string;
}

export interface Negotiation {
  id: string;
  clientId: string;
  title: string;
  serviceType: string;
  status: NegotiationStatus;
  value: number;
  validUntil?: string;
  sentDaysAgo?: number;
  revisionsUsed: number;
  revisionsTotal: number;
  nextStep: string;
  nextStepCta: string;
  scope?: Scope;
  proposals: Proposal[];
  contract?: Contract;
  payments: Payment[];
  interactions: Interaction[];
  timeline: TimelineEvent[];
  showHandoff?: boolean;
  linkedProjectId?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  highlighted?: boolean;
}

export interface Material {
  id: string;
  name: string;
  status: "pendente" | "recebido";
  receivedAt?: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: "pendente" | "concluido" | "atrasado";
}

export interface Project {
  id: string;
  clientId: string;
  negotiationId: string;
  name: string;
  type: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  deadline: string;
  daysRemaining: number;
  blockType: BlockType;
  blockDescription?: string;
  blockDays?: number;
  nextStep: string;
  nextStepCta: string;
  scopeSnapshot: Scope;
  materials: Material[];
  accessNotes: string[];
  kickoffNotes: string;
  checklist: ChecklistItem[];
  milestones: Milestone[];
  revisionsUsed: number;
  revisionsTotal: number;
  reviewRound: string;
  files: { id: string; name: string; folder: string; date: string }[];
  warranty?: { start: string; end: string; openTickets: number };
  timeline: TimelineEvent[];
  pendingNorax: string[];
  pendingClient: string[];
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  date: string;
  clientId?: string;
  projectId?: string;
  source: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  context: string;
  link?: string;
}

export interface DashboardMetrics {
  monthlyRevenue: number;
  revenueChange: number;
  pipeline: number;
  pipelineCount: number;
  activeProjects: number;
  projectsAtRisk: number;
  pendingPayments: number;
  pendingPaymentsValue: number;
}

export type ClientStatus = "ativo" | "lead" | "inativo";

export type TrendDirection = "up" | "down" | "neutral";

export interface ClientStat {
  id: string;
  title: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
}

export interface ClientRow {
  id: string;
  name: string;
  initials: string;
  contactName: string;
  email: string;
  projects: number;
  revenue: number;
  status: ClientStatus;
  lastContact: string;
  assignee: { name: string; initials: string };
}

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  percent: number;
  fill: string;
}

export interface StatusSegment {
  id: string;
  label: string;
  value: number;
  percent: number;
  fill: string;
}

export interface ClientActivity {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface ClientTask {
  id: string;
  title: string;
  priority: "alta" | "media" | "baixa";
  time: string;
  completed: boolean;
}

export interface ClientesData {
  stats: ClientStat[];
  clients: ClientRow[];
  totalClients: number;
  funnel: FunnelStage[];
  statusSegments: StatusSegment[];
  activities: ClientActivity[];
  tasks: ClientTask[];
}

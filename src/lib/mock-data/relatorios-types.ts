export type ReportTab =
  | "visao-geral"
  | "financeiro"
  | "projetos"
  | "clientes"
  | "contratos"
  | "produtividade"
  | "equipe"
  | "desempenho";

export type ReportPeriod = "maio-2024" | "abril-2024" | "marco-2024";

export type RevenueGranularity = "diario" | "semanal" | "mensal" | "anual";

export interface ReportStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  comparison: string;
  comparisonDirection: "up" | "down" | "neutral";
  sparkline: number[];
}

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface RevenueComparisonPoint {
  label: string;
  receitas: number;
  despesas: number;
}

export interface RevenueDistributionSegment {
  id: string;
  label: string;
  value: number;
  percentage: number;
  fill: string;
}

export interface ProjectPerformance {
  id: string;
  projeto: string;
  projetoId: string;
  cliente: string;
  faturamento: string;
  custo: string;
  lucro: string;
  margem: number;
  status: "concluido" | "em-andamento" | "planejamento";
  statusLabel: string;
}

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  width: number;
  fill: string;
}

export interface ProductivityMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
  comparison?: string;
}

export interface TopClient {
  id: string;
  rank: number;
  name: string;
  revenue: string;
  projects: number;
  lastProject: string;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
}

export interface RelatoriosData {
  periodLabel: string;
  stats: ReportStat[];
  revenueOverTime: Record<RevenueGranularity, RevenuePoint[]>;
  revenueComparison: RevenueComparisonPoint[];
  revenueDistribution: RevenueDistributionSegment[];
  projectsPerformance: ProjectPerformance[];
  salesFunnel: FunnelStage[];
  productivityMetrics: ProductivityMetric[];
  topClients: TopClient[];
  recentActivity: RecentActivityItem[];
}

export interface RelatoriosDataset {
  "maio-2024": RelatoriosData;
  "abril-2024": RelatoriosData;
  "marco-2024": RelatoriosData;
}

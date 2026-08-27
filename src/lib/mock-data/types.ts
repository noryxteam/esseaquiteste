export type StatColor = "blue" | "green" | "orange" | "red" | "purple";

export type TrendDirection = "up" | "down" | "neutral";

export interface DashboardKpi {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: StatColor;
  trend?: {
    value: string;
    direction: TrendDirection;
  };
}

export interface RevenueDataPoint {
  dia: number;
  valor: number;
}

export interface ProjectsChartDataPoint {
  semana: string;
  quantidade: number;
}

export interface PendingItem {
  id: string;
  title: string;
  count: number;
  color: StatColor;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  project: string;
  client: string;
  color: StatColor;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: "alta" | "media" | "baixa";
  completed: boolean;
}

export interface NoteItem {
  id: string;
  content: string;
  createdAt: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  client: string;
  stage: string;
  stageColor: StatColor;
  progress: number;
  dueDate: string;
  assignee: {
    name: string;
    initials: string;
  };
}

export interface BottomMetric {
  id: string;
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: TrendDirection;
  };
}

export interface DashboardData {
  user: {
    name: string;
    role: string;
    initials: string;
    email: string;
  };
  notifications: number;
  kpis: DashboardKpi[];
  revenue: {
    total: number;
    trend: string;
    trendDirection: TrendDirection;
    period: string;
    data: RevenueDataPoint[];
  };
  projectsChart: {
    total: number;
    trend: string;
    trendDirection: TrendDirection;
    data: ProjectsChartDataPoint[];
  };
  pending: PendingItem[];
  agenda: AgendaItem[];
  tasks: TaskItem[];
  notes: NoteItem[];
  projects: ProjectRow[];
  bottomMetrics: BottomMetric[];
}

export interface NavGroup {
  label?: string;
  items: {
    href: string;
    label: string;
    icon: string;
  }[];
}

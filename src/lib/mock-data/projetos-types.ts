export type ProjectTab = "todos" | "em-andamento" | "planejamento" | "pausados" | "concluidos";

export type ProjectCategory = "em-andamento" | "planejamento" | "concluido";

export type ProjectStage =
  | "desenvolvimento"
  | "design"
  | "qa"
  | "planejamento"
  | "pausado";

export type TrendDirection = "up" | "down" | "neutral";

export interface ProjectStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  trend?: string;
  trendDirection?: TrendDirection;
}

export interface TeamMember {
  id?: string;
  email?: string;
  uuid?: string;
  initials: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  category: ProjectCategory;
  stage: ProjectStage;
  stageLabel: string;
  progress: number;
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  team: TeamMember[];
  lead: TeamMember;
  priority: "alta" | "media" | "baixa";
}

export interface ProjectSection {
  id: ProjectCategory;
  title: string;
  view: "grid" | "list" | "completed";
  projectIds: string[];
}

export interface ProjetosData {
  stats: ProjectStat[];
  projects: Project[];
  sections: ProjectSection[];
}

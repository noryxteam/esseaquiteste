/**
 * Norax Design System — ponto de entrada único.
 */
export * from "./common";
export * from "./layout";
export * from "./navigation";
export * from "./buttons";
export * from "./inputs";
export * from "./badges";
export * from "./avatars";
export * from "./typography";
export * from "./tables";
export * from "./charts";
export * from "./forms";
export * from "./feedback";
export * from "./loaders";
export * from "./empty";
export * from "./filters";
export * from "./timeline";
export * from "./calendar";
export * from "./modals";
export * from "./drawers";
export * from "./dialogs";
export * from "./contracts";
export * from "./meetings";
export * from "./finance";

// Cards — exportados após common para evitar conflito de BaseCard
export {
  StatsCard,
  InfoCard,
  MetricCard,
  SummaryCard,
  ProgressCard,
  ActionCard,
  ContractCard,
  MeetingCard,
  ProjectCard,
  ClientCard,
  FinanceCard,
  BriefingCard,
  ReportCard,
} from "./cards";
export type {
  StatsCardProps,
  InfoCardProps,
  MetricCardProps,
  SummaryCardProps,
  SummaryItem,
  ProgressCardProps,
  ActionCardProps,
  ContractCardProps,
  MeetingCardProps,
  ProjectCardProps,
  ClientCardProps,
  FinanceCardProps,
  BriefingCardProps,
  BriefingSection,
  ReportCardProps,
  ReportMetric,
} from "./cards";

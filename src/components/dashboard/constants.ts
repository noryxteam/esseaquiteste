import type { StatColor, TrendDirection } from "@/lib/mock-data/types";

export const STAT_COLORS: Record<
  StatColor,
  { icon: string; dot: string; badge: string; text: string; bar: string }
> = {
  blue: {
    icon: "bg-state-blue/10 text-state-blue",
    dot: "bg-state-blue",
    badge: "bg-state-blue/15 text-state-blue",
    text: "text-state-blue",
    bar: "bg-state-blue",
  },
  green: {
    icon: "bg-state-green/10 text-state-green",
    dot: "bg-state-green",
    badge: "bg-state-green/15 text-state-green",
    text: "text-state-green",
    bar: "bg-state-green",
  },
  orange: {
    icon: "bg-state-orange/10 text-state-orange",
    dot: "bg-state-orange",
    badge: "bg-state-orange/15 text-state-orange",
    text: "text-state-orange",
    bar: "bg-state-orange",
  },
  red: {
    icon: "bg-state-red/10 text-state-red",
    dot: "bg-state-red",
    badge: "bg-state-red/15 text-state-red",
    text: "text-state-red",
    bar: "bg-state-red",
  },
  purple: {
    icon: "bg-state-purple/10 text-state-purple",
    dot: "bg-state-purple",
    badge: "bg-state-purple/15 text-state-purple",
    text: "text-state-purple",
    bar: "bg-state-purple",
  },
};

export const TREND_COLORS: Record<TrendDirection, string> = {
  up: "text-state-green",
  down: "text-state-red",
  neutral: "text-muted-foreground",
};

export const PRIORITY_LABELS = {
  alta: { label: "Prioridade alta", className: "text-white bg-white/10" },
  media: { label: "Prioridade média", className: "text-foreground/70 bg-white/5" },
  baixa: { label: "Prioridade baixa", className: "text-muted-foreground bg-surface-elevated" },
} as const;

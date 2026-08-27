import type { Priority, StatusColor } from "../common/types";
import { BadgeBase } from "./BadgeBase";

const PRIORITY_COLORS: Record<Priority, StatusColor> = {
  low: "neutral",
  medium: "blue",
  high: "orange",
  urgent: "red",
  urgente: "red",
  atencao: "orange",
  informativo: "blue",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
  urgente: "Urgente",
  atencao: "Atenção",
  informativo: "Informativo",
};

export interface PriorityBadgeProps {
  priority: Priority;
  label?: string;
  className?: string;
}

export function PriorityBadge({ priority, label, className }: PriorityBadgeProps) {
  return (
    <BadgeBase
      label={label ?? PRIORITY_LABELS[priority]}
      color={PRIORITY_COLORS[priority]}
      className={className}
    />
  );
}

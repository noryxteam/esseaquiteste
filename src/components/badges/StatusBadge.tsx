import type { EntityStatus, StatusColor } from "../common/types";
import { BadgeBase } from "./BadgeBase";

const STATUS_COLORS: Record<EntityStatus, StatusColor> = {
  active: "green",
  inactive: "neutral",
  pending: "orange",
  completed: "green",
  cancelled: "red",
  draft: "neutral",
  archived: "neutral",
  error: "red",
};

export interface StatusBadgeProps {
  status: EntityStatus;
  label?: string;
  className?: string;
}

const STATUS_LABELS: Record<EntityStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
  completed: "Concluído",
  cancelled: "Cancelado",
  draft: "Rascunho",
  archived: "Arquivado",
  error: "Erro",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <BadgeBase
      label={label ?? STATUS_LABELS[status]}
      color={STATUS_COLORS[status]}
      className={className}
    />
  );
}

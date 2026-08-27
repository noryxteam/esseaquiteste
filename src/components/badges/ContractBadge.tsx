import type { ContractStatus, StatusColor } from "../common/types";
import { BadgeBase } from "./BadgeBase";

const CONTRACT_COLORS: Record<ContractStatus, StatusColor> = {
  rascunho: "neutral",
  "aguardando-assinatura": "orange",
  enviado: "blue",
  assinado: "green",
  finalizado: "green",
  cancelado: "red",
  arquivado: "neutral",
  expirado: "red",
};

const CONTRACT_LABELS: Record<ContractStatus, string> = {
  rascunho: "Rascunho",
  "aguardando-assinatura": "Aguardando assinatura",
  enviado: "Enviado",
  assinado: "Assinado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
  arquivado: "Arquivado",
  expirado: "Expirado",
};

export interface ContractBadgeProps {
  status: ContractStatus;
  label?: string;
  className?: string;
}

export function ContractBadge({ status, label, className }: ContractBadgeProps) {
  return (
    <BadgeBase
      label={label ?? CONTRACT_LABELS[status]}
      color={CONTRACT_COLORS[status]}
      className={className}
    />
  );
}

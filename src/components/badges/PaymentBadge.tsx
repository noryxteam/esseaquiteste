import type { PaymentStatus, StatusColor } from "../common/types";
import { BadgeBase } from "./BadgeBase";

const PAYMENT_COLORS: Record<PaymentStatus, StatusColor> = {
  recebido: "green",
  pago: "green",
  pendente: "orange",
  parcial: "blue",
  atrasado: "red",
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  recebido: "Recebido",
  pago: "Pago",
  pendente: "Pendente",
  parcial: "Parcial",
  atrasado: "Atrasado",
};

export interface PaymentBadgeProps {
  status: PaymentStatus;
  label?: string;
  className?: string;
}

export function PaymentBadge({ status, label, className }: PaymentBadgeProps) {
  return (
    <BadgeBase
      label={label ?? PAYMENT_LABELS[status]}
      color={PAYMENT_COLORS[status]}
      className={className}
    />
  );
}

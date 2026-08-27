import { CreditCard } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { EmptyStateProps } from "./EmptyState";

export interface EmptyPaymentsProps extends Omit<EmptyStateProps, "icon" | "title" | "description"> {
  title?: string;
  description?: string;
}

export function EmptyPayments({
  title = "Nenhum pagamento registrado",
  description = "Registre recebimentos e despesas para acompanhar o fluxo financeiro.",
  actionLabel = "Registrar pagamento",
  ...props
}: EmptyPaymentsProps) {
  return (
    <EmptyState
      icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      {...props}
    />
  );
}

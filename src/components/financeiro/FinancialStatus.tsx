import type { FinancialStatus } from "@/lib/mock-data/financeiro-types";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES: Record<FinancialStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  recebido: { bg: "bg-state-green/10", text: "text-state-green", icon: CheckCircle2 },
  pago: { bg: "bg-state-green/10", text: "text-state-green", icon: CheckCircle2 },
  pendente: { bg: "bg-state-orange/10", text: "text-state-orange", icon: Clock },
  parcial: { bg: "bg-state-blue/10", text: "text-state-blue", icon: Clock },
  atrasado: { bg: "bg-state-red/10", text: "text-state-red", icon: AlertCircle },
};

interface FinancialStatusProps {
  status: FinancialStatus;
  label: string;
  className?: string;
}

export function FinancialStatus({ status, label, className }: FinancialStatusProps) {
  const styles = STYLES[status] ?? STYLES.pendente;
  const Icon = styles.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium",
        styles.bg,
        styles.text,
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

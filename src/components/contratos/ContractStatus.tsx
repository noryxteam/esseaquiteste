import type { ContractStatus } from "@/lib/mock-data/contratos-types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  ContractStatus,
  { dot: string; bg: string; text: string }
> = {
  rascunho: {
    dot: "bg-white/40",
    bg: "bg-white/[0.06]",
    text: "text-muted-foreground",
  },
  "aguardando-assinatura": {
    dot: "bg-state-orange/80",
    bg: "bg-state-orange/10",
    text: "text-state-orange",
  },
  enviado: {
    dot: "bg-state-blue/80",
    bg: "bg-state-blue/10",
    text: "text-state-blue",
  },
  assinado: {
    dot: "bg-state-green/80",
    bg: "bg-state-green/10",
    text: "text-state-green",
  },
  finalizado: {
    dot: "bg-state-green/60",
    bg: "bg-state-green/10",
    text: "text-state-green",
  },
  cancelado: {
    dot: "bg-state-red/80",
    bg: "bg-state-red/10",
    text: "text-state-red",
  },
  arquivado: {
    dot: "bg-white/30",
    bg: "bg-white/[0.04]",
    text: "text-muted-foreground",
  },
  expirado: {
    dot: "bg-state-red/60",
    bg: "bg-state-red/10",
    text: "text-state-red",
  },
};

interface ContractStatusProps {
  status: ContractStatus;
  label: string;
  className?: string;
}

export function ContractStatusBadge({ status, label, className }: ContractStatusProps) {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium",
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", styles.dot)} />
      {label}
    </span>
  );
}

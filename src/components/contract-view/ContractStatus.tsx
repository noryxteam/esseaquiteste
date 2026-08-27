import type { ContractStatus } from "@/lib/mock-data/contratos-types";
import { cn } from "@/lib/utils";

const STYLES: Record<string, { dot: string; bg: string; text: string }> = {
  assinado: { dot: "bg-emerald-400/80", bg: "bg-emerald-500/10", text: "text-emerald-400/90" },
  finalizado: { dot: "bg-emerald-400/60", bg: "bg-emerald-500/10", text: "text-emerald-400/80" },
  "aguardando-assinatura": { dot: "bg-amber-400/70", bg: "bg-amber-500/10", text: "text-amber-400/80" },
  "parcialmente-assinado": { dot: "bg-sky-400/70", bg: "bg-sky-500/10", text: "text-sky-400/80" },
  enviado: { dot: "bg-sky-400/60", bg: "bg-sky-500/10", text: "text-sky-400/80" },
  cancelado: { dot: "bg-red-400/50", bg: "bg-red-500/[0.08]", text: "text-red-400/70" },
  expirado: { dot: "bg-orange-400/50", bg: "bg-orange-500/[0.08]", text: "text-orange-400/70" },
  rascunho: { dot: "bg-white/35", bg: "bg-white/[0.05]", text: "text-white/50" },
};

interface ContractStatusProps {
  status: string;
  label: string;
  className?: string;
}

export function ContractStatus({ status, label, className }: ContractStatusProps) {
  const styles = STYLES[status] ?? STYLES.rascunho;

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

import type { ClientStatus } from "@/lib/mock-data/clientes-types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<ClientStatus, { label: string; dot: string; className: string }> = {
  ativo: {
    label: "Ativo",
    dot: "bg-state-green",
    className: "text-foreground/90 bg-white/5 border-white/10",
  },
  lead: {
    label: "Lead",
    dot: "bg-foreground/40",
    className: "text-muted-foreground bg-surface-elevated border-border-subtle",
  },
  inativo: {
    label: "Inativo",
    dot: "bg-foreground/25",
    className: "text-muted-foreground bg-surface-elevated border-border-subtle",
  },
};

export function StatusBadge({ status }: { status: ClientStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        config.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}

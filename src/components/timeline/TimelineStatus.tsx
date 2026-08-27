import { cn } from "@/lib/utils";

type TimelineStatusType = "default" | "active" | "completed" | "pending" | "error";

const LABELS: Record<TimelineStatusType, string> = {
  default: "Padrão",
  active: "Em andamento",
  completed: "Concluído",
  pending: "Pendente",
  error: "Erro",
};

interface TimelineStatusProps {
  status: TimelineStatusType;
  className?: string;
}

export function TimelineStatus({ status, className }: TimelineStatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground",
        status === "active" && "text-foreground",
        status === "error" && "border-state-red/30 text-state-red",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" && "bg-foreground",
          status === "completed" && "bg-foreground/60",
          status === "pending" && "border border-border-strong",
          status === "error" && "bg-state-red",
          status === "default" && "bg-muted-foreground/50"
        )}
      />
      {LABELS[status]}
    </span>
  );
}

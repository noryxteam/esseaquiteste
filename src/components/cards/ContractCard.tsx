import { Eye } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ContractCardProps {
  title: string;
  client: string;
  number?: string;
  status?: React.ReactNode;
  statusLabel?: string;
  value?: string;
  createdAt?: string;
  sentAt?: string;
  responsibleInitials?: string;
  actionLabel?: string;
  onSelect?: () => void;
  onAction?: () => void;
  className?: string;
  preview?: React.ReactNode;
}

export function ContractCard({
  title,
  client,
  number,
  status,
  statusLabel,
  value,
  createdAt,
  sentAt,
  responsibleInitials,
  actionLabel = "Visualizar",
  onSelect,
  onAction,
  className,
  preview,
}: ContractCardProps) {
  const handleAction = onAction ?? onSelect;

  return (
    <BaseCard padding="none" hover className={cn("group overflow-hidden", className)}>
      {preview && <div className="p-3 pb-0">{preview}</div>}

      <div
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onClick={onSelect}
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect();
                }
              }
            : undefined
        }
        className={cn("space-y-3 p-4", onSelect && "cursor-pointer")}
      >
        <div className="min-w-0">
          <p className="truncate text-[11px] text-muted-foreground">{client}</p>
          <p className="mt-0.5 truncate text-sm font-medium text-foreground">{title}</p>
          {number && <p className="mt-1 font-mono text-[10px] text-muted-foreground">{number}</p>}
        </div>

        {(status || statusLabel) && (
          <div>{status ?? <span className="text-[11px] text-foreground/70">{statusLabel}</span>}</div>
        )}

        {(createdAt || sentAt) && (
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {createdAt && (
              <div>
                <p className="text-muted-foreground">Criação</p>
                <p className="mt-0.5 tabular-nums text-foreground/80">{createdAt}</p>
              </div>
            )}
            {sentAt !== undefined && (
              <div>
                <p className="text-muted-foreground">Envio</p>
                <p className="mt-0.5 tabular-nums text-foreground/80">{sentAt || "—"}</p>
              </div>
            )}
          </div>
        )}

        {value && (
          <div className="flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Valor</p>
              <p className="text-sm font-medium tabular-nums text-foreground">{value}</p>
            </div>
            {responsibleInitials && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-elevated text-[9px] font-medium">
                {responsibleInitials}
              </div>
            )}
          </div>
        )}
      </div>

      {handleAction && (
        <div className="px-4 pb-4">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full border-border-subtle text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            onClick={handleAction}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            {actionLabel}
          </Button>
        </div>
      )}
    </BaseCard>
  );
}

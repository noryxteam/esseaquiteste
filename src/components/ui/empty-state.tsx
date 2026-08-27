import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({ title, description, actionLabel, onAction, compact }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-surface-inset text-center",
        compact ? "py-6 px-4" : "py-8 px-5"
      )}
    >
      <div className="mx-auto h-8 w-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center mb-3">
        <span className="text-muted-foreground text-sm">—</span>
      </div>
      <p className="text-[13px] font-medium text-foreground-secondary">{title}</p>
      {description && <p className="mt-1 text-[12px] text-muted-foreground max-w-xs mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-3" size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

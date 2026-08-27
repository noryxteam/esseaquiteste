import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border-subtle bg-[#090909] text-center",
        compact ? "px-4 py-6" : "px-5 py-8",
        className
      )}
    >
      <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-elevated">
        {icon ?? <span className="text-sm text-muted-foreground">—</span>}
      </div>
      <p className="text-[13px] font-medium text-foreground-secondary">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-xs text-[12px] text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-3" size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

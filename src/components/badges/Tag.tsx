import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";

export interface TagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function Tag({ label, onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        tokens.badge.base,
        tokens.badge.sm,
        "gap-1",
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${label}`}
          className="ml-0.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
}

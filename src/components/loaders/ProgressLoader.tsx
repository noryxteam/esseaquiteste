import { cn } from "@/lib/utils";

export interface ProgressLoaderProps {
  value?: number;
  indeterminate?: boolean;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function ProgressLoader({
  value = 0,
  indeterminate = false,
  label,
  size = "md",
  className,
}: ProgressLoaderProps) {
  return (
    <div className={cn("w-full", className)} role="progressbar" aria-valuenow={indeterminate ? undefined : value}>
      {(label || !indeterminate) && (
        <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
          {label && <span>{label}</span>}
          {!indeterminate && <span className="tabular-nums">{Math.min(100, Math.max(0, value))}%</span>}
        </div>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-full border border-border-subtle bg-surface-inset",
          size === "sm" ? "h-1" : "h-1.5"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-foreground/80",
            indeterminate
              ? "w-full animate-pulse opacity-60"
              : "transition-all duration-500"
          )}
          style={indeterminate ? undefined : { width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

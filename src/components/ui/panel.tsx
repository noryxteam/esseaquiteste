import { cn } from "@/lib/utils";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  inset?: boolean;
}

export function Panel({ children, className, padding = true, inset = false }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface",
        inset && "bg-surface-inset",
        padding && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3 mb-3", className)}>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </h3>
      {action}
    </div>
  );
}

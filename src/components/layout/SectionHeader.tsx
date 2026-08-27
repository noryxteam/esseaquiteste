import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  count?: number;
  className?: string;
}

export function SectionHeader({ title, description, actions, count, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {title}
          </h2>
          {count !== undefined && (
            <span className="text-[10px] font-medium text-muted-foreground bg-surface-elevated border border-border-subtle px-1.5 py-0.5 rounded">
              {count}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

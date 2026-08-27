import { BarChart3 } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { Button } from "@/components/ui/button";

export interface ReportMetric {
  label: string;
  value: string | number;
}

export interface ReportCardProps {
  title: string;
  description?: string;
  metrics?: ReportMetric[];
  period?: string;
  actionLabel?: string;
  onView?: () => void;
  chart?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function ReportCard({
  title,
  description,
  metrics,
  period,
  actionLabel = "Ver relatório",
  onView,
  chart,
  icon,
  className,
}: ReportCardProps) {
  return (
    <BaseCard hover className={className}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
            {icon ?? <BarChart3 className="h-4 w-4 text-foreground/80" />}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-foreground">{title}</h3>
            {description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{description}</p>
            )}
            {period && <p className="mt-1 text-[10px] text-muted-foreground">{period}</p>}
          </div>
        </div>
      </div>

      {metrics && metrics.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md border border-border-subtle bg-[#090909]/50 p-2.5">
              <p className="text-[10px] text-muted-foreground">{metric.label}</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      {chart && <div className="mb-4">{chart}</div>}

      {onView && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full border-border-subtle text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          onClick={onView}
        >
          {actionLabel}
        </Button>
      )}
    </BaseCard>
  );
}

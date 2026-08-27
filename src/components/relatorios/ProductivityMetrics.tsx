import {
  Calendar,
  CheckSquare,
  Clock,
  RefreshCw,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { ProductivityMetric } from "@/lib/mock-data/relatorios-types";

const ICON_MAP: Record<string, LucideIcon> = {
  Clock,
  CheckSquare,
  Calendar,
  RefreshCw,
  Timer,
};

interface ProductivityMetricsProps {
  metrics: ProductivityMetric[];
}

export function ProductivityMetrics({ metrics }: ProductivityMetricsProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5 h-full flex flex-col">
      <h2 className="text-sm font-medium text-foreground mb-4">Indicadores de produtividade</h2>
      <ul className="space-y-0 flex-1">
        {metrics.map((metric) => {
          const Icon = ICON_MAP[metric.icon] ?? Clock;
          return (
            <li
              key={metric.id}
              className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0"
            >
              <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="h-3.5 w-3.5 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                <p className="text-sm font-semibold text-foreground tabular-nums mt-0.5">{metric.value}</p>
                {metric.comparison && (
                  <p className="text-[9px] text-muted-foreground/70 mt-0.5">{metric.comparison}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

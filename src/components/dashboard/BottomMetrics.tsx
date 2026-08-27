"use client";

import { useRouter } from "next/navigation";
import type { BottomMetric } from "@/lib/mock-data/types";
import { TREND_COLORS } from "@/components/dashboard/constants";
import { BOTTOM_METRIC_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

const METRIC_ROUTE_MAP: Record<string, string> = {
  clients: BOTTOM_METRIC_ROUTES.clientes,
  active: BOTTOM_METRIC_ROUTES.projetos,
  done: BOTTOM_METRIC_ROUTES.projetos,
  rate: BOTTOM_METRIC_ROUTES.tasks,
  satisfaction: BOTTOM_METRIC_ROUTES.contratos,
};

interface BottomMetricsProps {
  metrics: BottomMetric[];
}

export function BottomMetrics({ metrics }: BottomMetricsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {metrics.map((metric) => {
        const href = METRIC_ROUTE_MAP[metric.id];
        return (
          <button
            key={metric.id}
            type="button"
            onClick={() => href && router.push(href)}
            className={cn(
              "rounded-lg border border-border bg-surface px-4 py-3 hover:border-border-strong hover:bg-surface-hover transition-all text-left",
              href && "cursor-pointer"
            )}
          >
            <p className="text-[11px] text-muted-foreground">{metric.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-lg font-semibold tabular-nums">{metric.value}</p>
              {metric.trend && (
                <span className={cn("text-[10px] font-medium", TREND_COLORS[metric.trend.direction])}>
                  {metric.trend.value}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

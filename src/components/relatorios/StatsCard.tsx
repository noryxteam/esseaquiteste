"use client";

import {
  CheckCircle2,
  DollarSign,
  Star,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReportStat } from "@/lib/mock-data/relatorios-types";
import { SparklineChart } from "@/components/relatorios/SparklineChart";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Users,
  Target,
  Star,
};

interface StatsCardProps extends ReportStat {}

export function StatsCard({
  title,
  value,
  icon,
  comparison,
  comparisonDirection = "neutral",
  sparkline,
}: StatsCardProps) {
  const Icon = ICON_MAP[icon] ?? DollarSign;

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 hover:border-border hover:bg-surface-hover/60 transition-colors min-w-[160px]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-muted-foreground truncate">{title}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums text-foreground truncate">
            {value}
          </p>
          <p
            className={cn(
              "mt-1 text-[9px] text-muted-foreground",
              comparisonDirection === "up" && "text-foreground/60",
              comparisonDirection === "down" && "text-muted-foreground"
            )}
          >
            {comparison}
          </p>
        </div>
        <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center shrink-0">
          <Icon className="h-3.5 w-3.5 text-foreground/80" />
        </div>
      </div>
      <SparklineChart data={sparkline} />
    </div>
  );
}

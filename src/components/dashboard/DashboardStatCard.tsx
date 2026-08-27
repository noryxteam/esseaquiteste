"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Package,
  Users,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { DashboardKpi } from "@/lib/mock-data/types";
import { TREND_COLORS } from "@/components/dashboard/constants";
import { cn, formatNumber } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Video,
  Users,
  FileText,
  Wallet,
  Package,
};

interface DashboardStatCardProps extends DashboardKpi {
  index?: number;
  href?: string;
}

function MetricValue({ value }: { value: string | number }) {
  if (typeof value === "number") {
    return (
      <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums text-foreground">
        {formatNumber(value)}
      </span>
    );
  }

  const currency = value.match(/^(R\$)\s*(.+)$/);
  if (currency) {
    return (
      <span className="text-xl font-semibold leading-none tracking-tight tabular-nums text-foreground">
        <span className="text-base font-semibold text-foreground/90">{currency[1]}</span>{" "}
        {currency[2]}
      </span>
    );
  }

  return (
    <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums text-foreground">
      {value}
    </span>
  );
}

function TrendBadge({ trend }: { trend: NonNullable<DashboardKpi["trend"]> }) {
  return (
    <span
      className={cn(
        "text-[10px] font-medium leading-none whitespace-nowrap",
        TREND_COLORS[trend.direction]
      )}
    >
      {trend.direction === "up" && "▲ "}
      {trend.direction === "down" && "▼ "}
      {trend.value}
    </span>
  );
}

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  index = 0,
  href,
}: DashboardStatCardProps) {
  const Icon = ICON_MAP[icon] ?? Users;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        "group relative rounded-xl border border-border-subtle bg-surface/60 p-3.5",
        "hover:border-border hover:bg-surface-hover/80 transition-colors duration-200",
        href && "cursor-pointer"
      )}
    >
      {trend && (
        <div className="absolute top-3 right-3">
          <TrendBadge trend={trend} />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Icon className="h-4 w-4 stroke-[1.75] text-white" />
        </div>

        <div className="min-w-0 flex-1 pr-12">
          <MetricValue value={value} />
          <p className="mt-1 text-[11px] font-bold leading-tight text-foreground whitespace-nowrap">
            {title}
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground/80">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

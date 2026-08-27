"use client";

import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Clock,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import type { FinancialStat } from "@/lib/mock-data/financeiro-types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  ArrowDownCircle,
  Clock,
  ArrowUpCircle,
  BarChart3,
};

const TONE_STYLES = {
  blue: "bg-state-blue/10 text-state-blue",
  green: "bg-state-green/10 text-state-green",
  yellow: "bg-state-orange/10 text-state-orange",
  red: "bg-state-red/10 text-state-red",
  neutral: "bg-white/10 text-white",
} as const;

interface StatsCardProps extends FinancialStat {
  index?: number;
}

export function StatsCard({
  title,
  value,
  icon,
  iconTone,
  subtitle,
  subtitleDirection = "neutral",
  index = 0,
}: StatsCardProps) {
  const Icon = ICON_MAP[icon] ?? DollarSign;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="rounded-lg border border-border-subtle bg-surface/60 p-4 hover:border-border hover:bg-surface-hover/60 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-foreground">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "mt-1 text-[10px] font-medium",
                subtitleDirection === "up" && "text-state-green",
                subtitleDirection === "down" && "text-state-red",
                subtitleDirection === "neutral" && "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "h-8 w-8 rounded-md flex items-center justify-center shrink-0",
            TONE_STYLES[iconTone]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}

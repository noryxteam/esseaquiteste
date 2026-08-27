"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  Play,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { ProjectStat } from "@/lib/mock-data/projetos-types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  FolderKanban,
  Play,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
};

interface StatsCardProps extends ProjectStat {
  index?: number;
}

export function StatsCard({ title, value, icon, trend, trendDirection = "up", index = 0 }: StatsCardProps) {
  const Icon = ICON_MAP[icon] ?? FolderKanban;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="rounded-lg border border-border-subtle bg-surface/60 p-4 hover:border-border hover:bg-surface-hover/60 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-[10px] font-medium",
                trendDirection === "up" && "text-state-green",
                trendDirection === "down" && "text-state-red",
                trendDirection === "neutral" && "text-muted-foreground"
              )}
            >
              {trend}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

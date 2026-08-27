"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { MeetingStat } from "@/lib/mock-data/reunioes-types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  FileText,
};

interface StatsCardProps extends MeetingStat {
  index?: number;
}

export function StatsCard({
  title,
  value,
  icon,
  subtitle,
  subtitleDirection = "neutral",
  index = 0,
}: StatsCardProps) {
  const Icon = ICON_MAP[icon] ?? Calendar;

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
          {subtitle && (
            <p
              className={cn(
                "mt-1 text-[10px] font-medium",
                subtitleDirection === "up" && "text-state-green",
                subtitleDirection === "down" && "text-state-red",
                subtitleDirection === "warning" && "text-state-orange",
                subtitleDirection === "neutral" && "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

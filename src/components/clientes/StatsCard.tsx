"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ClientStat } from "@/lib/mock-data/clientes-types";
import { cn } from "@/lib/utils";

interface StatsCardProps extends ClientStat {
  index?: number;
  href?: string;
}

export function StatsCard({ title, value, trend, trendDirection = "up", index = 0, href }: StatsCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        "rounded-lg border border-border-subtle bg-surface/60 p-4 hover:border-border hover:bg-surface-hover/60 transition-colors",
        href && "cursor-pointer"
      )}
    >
      <p className="text-[11px] text-muted-foreground">{title}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight tabular-nums text-foreground">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1.5 text-[10px] font-medium",
            trendDirection === "up" && "text-state-green",
            trendDirection === "down" && "text-state-red",
            trendDirection === "neutral" && "text-muted-foreground"
          )}
        >
          {trend}
        </p>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

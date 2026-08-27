"use client";

import { motion } from "framer-motion";
import type { MeetingStat } from "@/lib/mock-data/reunioes-types";
import { StatsCard } from "@/components/reunioes/StatsCard";

interface MeetingStatsProps {
  stats: MeetingStat[];
}

export function MeetingStats({ stats }: MeetingStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3"
    >
      {stats.map((stat, i) => (
        <StatsCard key={stat.id} {...stat} index={i} />
      ))}
    </motion.div>
  );
}

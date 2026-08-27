"use client";

import { motion } from "framer-motion";
import { getGreeting } from "@/lib/utils";

interface DashboardHeaderProps {
  userName: string;
  subtitle?: string;
}

export function DashboardHeader({ userName, subtitle = "Aqui está o resumo da sua empresa hoje." }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-6"
    >
      <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
        {getGreeting(userName)}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}

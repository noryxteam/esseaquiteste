"use client";

import { cn } from "@/lib/utils";

interface ProjectProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

/** Barra de progresso somente leitura (listas / cards). */
export function ProjectProgress({ value, className, showLabel = true }: ProjectProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden">
        <div className="h-full rounded-full bg-white" style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && (
        <span className="text-[11px] text-foreground/50 tabular-nums w-8 text-right shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
}

"use client";

import { memo } from "react";
import type { FunnelStage } from "@/lib/mock-data/clientes-types";

interface FunnelCardProps {
  stages: FunnelStage[];
}

function FunnelCardInner({ stages }: FunnelCardProps) {
  const max = Math.max(...stages.map((s) => s.value), 0);

  return (
    <div className="rounded-lg border border-border bg-surface p-4 hover:border-border-strong transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-foreground">Funil de clientes</p>
        <select className="h-7 rounded-md border border-border bg-surface-inset px-2 text-[10px] text-muted-foreground focus:outline-none">
          <option>Este mês</option>
        </select>
      </div>
      <div className="space-y-2">
        {stages.map((stage) => {
          const width = max === 0 || stage.value === 0 ? 8 : Math.max(20, (stage.value / max) * 100);
          return (
            <div key={stage.id} className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground w-20 shrink-0 truncate">{stage.label}</span>
              <div className="flex-1 flex justify-center">
                <div
                  className="h-6 rounded-sm transition-all"
                  style={{
                    width: `${width}%`,
                    backgroundColor: stage.fill,
                    minWidth: stage.value === 0 ? 8 : 24,
                    opacity: stage.value === 0 ? 0.35 : 1,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums w-16 text-right shrink-0">
                {stage.value} ({stage.percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const FunnelCard = memo(FunnelCardInner);

"use client";

import { cn } from "@/lib/utils";
import { MONOCHROME_SERIES } from "./constants";

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  className?: string;
  showValues?: boolean;
}

export function FunnelChart({ stages, className, showValues = true }: FunnelChartProps) {
  const maxValue = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      {stages.map((stage, index) => {
        const widthPercent = Math.max((stage.value / maxValue) * 100, 20);
        const fill = MONOCHROME_SERIES[Math.min(index, MONOCHROME_SERIES.length - 1)];

        return (
          <div key={stage.id} className="w-full flex flex-col items-center">
            <div
              className="h-7 rounded-sm flex items-center justify-between px-3 transition-all"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: fill,
                minWidth: "120px",
                color: index < 2 ? "#09090b" : "#fafafa",
              }}
            >
              <span className="text-[10px] font-medium truncate">{stage.label}</span>
              {showValues && (
                <span className="text-[10px] font-semibold tabular-nums ml-2">{stage.value}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

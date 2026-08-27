"use client";

import type { FinancialFlowSegment } from "@/lib/mock-data/financeiro-types";
import { Info } from "lucide-react";

interface FinancialFlowProps {
  segments: FinancialFlowSegment[];
}

export function FinancialFlow({ segments }: FinancialFlowProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-medium text-foreground">Fluxo financeiro</h2>
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-surface-inset">
        {segments.map((segment) => {
          const width = total > 0 ? (segment.value / total) * 100 : 0;
          return (
            <div
              key={segment.id}
              className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${width}%`,
                backgroundColor: segment.color,
                minWidth: width > 0 ? "4px" : 0,
              }}
            />
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((segment) => (
          <div key={segment.id}>
            <p className="text-[10px] text-muted-foreground">{segment.label}</p>
            <p
              className="mt-0.5 text-sm font-medium tabular-nums"
              style={{ color: segment.color }}
            >
              {segment.valueFormatted}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { StatusSegment } from "@/lib/mock-data/clientes-types";

interface StatusChartProps {
  segments: StatusSegment[];
  total: number;
}

function StatusChartInner({ segments, total }: StatusChartProps) {
  const chartData =
    total === 0 ? [{ id: "empty", label: "Vazio", value: 1, fill: "#3f3f46" }] : segments;

  return (
    <div className="rounded-lg border border-border bg-surface p-4 hover:border-border-strong transition-colors">
      <p className="text-sm font-medium text-foreground mb-4">Distribuição de clientes</p>
      <div className="flex items-center gap-4">
        <div className="relative h-[120px] w-[120px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                stroke="none"
                paddingAngle={total === 0 ? 0 : 2}
              >
                {chartData.map((seg) => (
                  <Cell key={seg.id} fill={seg.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-semibold text-foreground tabular-nums">{total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>
        <ul className="flex-1 space-y-2 min-w-0">
          {segments.map((seg) => (
            <li key={seg.id} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2 text-muted-foreground min-w-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.fill }} />
                <span className="truncate">{seg.label}</span>
              </span>
              <span className="text-foreground/70 tabular-nums shrink-0">
                {seg.value} ({seg.percent}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const StatusChart = memo(StatusChartInner);

"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { RevenueDistributionSegment } from "@/lib/mock-data/relatorios-types";

interface RevenueDistributionProps {
  segments: RevenueDistributionSegment[];
}

export function RevenueDistribution({ segments }: RevenueDistributionProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5 h-full flex flex-col">
      <h2 className="text-sm font-medium text-foreground mb-4">Distribuição da receita</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        <div className="relative h-[140px] w-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                stroke="none"
                paddingAngle={2}
                isAnimationActive={false}
              >
                {segments.map((seg) => (
                  <Cell key={seg.id} fill={seg.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex-1 space-y-2 min-w-0 w-full">
          {segments.map((seg) => (
            <li key={seg.id} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[10px] text-muted-foreground min-w-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.fill }} />
                <span className="truncate">{seg.label}</span>
              </span>
              <span className="text-[10px] text-foreground/70 tabular-nums shrink-0">{seg.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

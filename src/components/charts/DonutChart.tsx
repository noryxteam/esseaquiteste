"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_ANIMATION, CHART_COLORS, MONOCHROME_SERIES } from "./constants";
import { cn } from "@/lib/utils";

export interface DonutSegment {
  label: string;
  value: number;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
  showLegend?: boolean;
}

export function DonutChart({
  segments,
  size = 160,
  innerRadius = 50,
  outerRadius = 70,
  className,
  showLegend = true,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={0}
              {...CHART_ANIMATION}
            >
              {segments.map((_, i) => (
                <Cell key={i} fill={MONOCHROME_SERIES[i % MONOCHROME_SERIES.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: CHART_COLORS.tooltipBg,
                borderColor: CHART_COLORS.tooltipBorder,
                borderRadius: 6,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {showLegend && (
        <div className="space-y-2 flex-1">
          {segments.map((seg, i) => (
            <div key={seg.label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: MONOCHROME_SERIES[i % MONOCHROME_SERIES.length] }}
              />
              <span className="truncate">{seg.label}</span>
              <span className="text-foreground tabular-nums ml-auto">
                {Math.round((seg.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

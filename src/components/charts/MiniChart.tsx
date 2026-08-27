"use client";

import { Line, LineChart as RechartsLineChart, ResponsiveContainer } from "recharts";
import { CHART_ANIMATION, CHART_COLORS } from "./constants";
import { cn } from "@/lib/utils";

export interface MiniChartProps {
  data: number[];
  height?: number;
  className?: string;
  strokeWidth?: number;
}

export function MiniChart({
  data,
  height = 40,
  className,
  strokeWidth = 1.5,
}: MiniChartProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS.primary}
            strokeWidth={strokeWidth}
            dot={false}
            {...CHART_ANIMATION}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

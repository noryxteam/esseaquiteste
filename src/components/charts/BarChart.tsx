"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_ANIMATION, CHART_COLORS, MONOCHROME_SERIES } from "./constants";
import { cn } from "@/lib/utils";

export interface BarChartDataPoint {
  [key: string]: string | number;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
  barRadius?: number;
  multipleKeys?: string[];
}

export function BarChart({
  data,
  dataKey,
  xAxisKey,
  height = 200,
  className,
  showGrid = true,
  barRadius = 4,
  multipleKeys,
}: BarChartProps) {
  const keys = multipleKeys ?? [dataKey];

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          {showGrid && <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_COLORS.tooltipBg,
              borderColor: CHART_COLORS.tooltipBorder,
              borderRadius: 6,
              fontSize: 12,
            }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          {keys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={MONOCHROME_SERIES[i % MONOCHROME_SERIES.length]}
              radius={[barRadius, barRadius, 0, 0]}
              {...CHART_ANIMATION}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useId } from "react";
import { CHART_ANIMATION, CHART_COLORS } from "./constants";
import { cn } from "@/lib/utils";

export interface AreaChartDataPoint {
  [key: string]: string | number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
  strokeWidth?: number;
}

export function AreaChart({
  data,
  dataKey,
  xAxisKey,
  height = 200,
  className,
  showGrid = true,
  strokeWidth = 2,
}: AreaChartProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(250,250,250,0.12)" />
              <stop offset="100%" stopColor="rgba(250,250,250,0)" />
            </linearGradient>
          </defs>
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
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={CHART_COLORS.primary}
            strokeWidth={strokeWidth}
            fill={`url(#${gradientId})`}
            dot={false}
            {...CHART_ANIMATION}
            activeDot={{ r: 4, fill: CHART_COLORS.primary, stroke: "#09090b", strokeWidth: 2 }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

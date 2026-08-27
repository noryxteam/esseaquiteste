"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_ANIMATION, CHART_COLORS } from "./constants";
import { cn } from "@/lib/utils";

export interface LineChartDataPoint {
  [key: string]: string | number;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showAxis?: boolean;
  strokeWidth?: number;
  formatTooltip?: (value: number, label: string) => React.ReactNode;
}

function DefaultTooltip({
  active,
  payload,
  label,
  formatTooltip,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
  formatTooltip?: (value: number, label: string) => React.ReactNode;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div
      className="rounded-md border px-3 py-2 shadow-xl"
      style={{
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
      }}
    >
      {formatTooltip ? (
        formatTooltip(value, String(label))
      ) : (
        <>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">{value}</p>
        </>
      )}
    </div>
  );
}

export function LineChart({
  data,
  dataKey,
  xAxisKey,
  height = 200,
  className,
  showGrid = true,
  showAxis = true,
  strokeWidth = 2,
  formatTooltip,
}: LineChartProps) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 4, right: 4, left: showAxis ? -20 : 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          )}
          {showAxis && (
            <>
              <XAxis
                dataKey={xAxisKey}
                tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={["auto", "auto"]} />
            </>
          )}
          <Tooltip
            content={<DefaultTooltip formatTooltip={formatTooltip} />}
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={CHART_COLORS.primary}
            strokeWidth={strokeWidth}
            dot={false}
            {...CHART_ANIMATION}
            activeDot={{ r: 4, fill: CHART_COLORS.primary, stroke: "#09090b", strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

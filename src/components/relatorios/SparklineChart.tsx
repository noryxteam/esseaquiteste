"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
  data: number[];
  className?: string;
}

export function SparklineChart({ data, className }: SparklineChartProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className={className ?? "h-10 w-full mt-3"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#fafafa"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

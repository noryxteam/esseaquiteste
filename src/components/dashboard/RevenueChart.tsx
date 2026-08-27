"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueDataPoint } from "@/lib/mock-data/types";
import { formatCurrencyFull } from "@/lib/utils";
import { TREND_COLORS } from "@/components/dashboard/constants";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS = ["Este mês", "Últimos 3 meses", "Últimos 6 meses"];

interface RevenueChartProps {
  data: RevenueDataPoint[];
  total: number;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
  period: string;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: RevenueDataPoint }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface-elevated px-3 py-2 shadow-xl">
      <p className="text-[10px] text-muted-foreground">Dia {payload[0].payload.dia}</p>
      <p className="text-sm font-semibold tabular-nums">{formatCurrencyFull(payload[0].value)}</p>
    </div>
  );
}

export function RevenueChart({ data, total, trend, trendDirection, period }: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5 hover:border-border-strong transition-colors h-full flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Receita do mês</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums">{formatCurrencyFull(total)}</p>
          <p className={cn("mt-1 text-xs font-medium", TREND_COLORS[trendDirection])}>{trend} vs mês anterior</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="h-8 rounded-md border border-border bg-surface-inset px-2 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(250,250,250,0.12)" />
                <stop offset="100%" stopColor="rgba(250,250,250,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="dia" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#fafafa"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 4, fill: "#fafafa", stroke: "#09090b", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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
import type { RevenueGranularity, RevenuePoint } from "@/lib/mock-data/relatorios-types";
import { cn } from "@/lib/utils";

const GRANULARITY_OPTIONS: { id: RevenueGranularity; label: string }[] = [
  { id: "diario", label: "Diário" },
  { id: "semanal", label: "Semanal" },
  { id: "mensal", label: "Mensal" },
  { id: "anual", label: "Anual" },
];

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: RevenuePoint }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border-subtle bg-surface-elevated px-3 py-2 shadow-xl">
      <p className="text-[10px] text-muted-foreground">{payload[0].payload.label}</p>
      <p className="text-sm font-semibold tabular-nums text-foreground">
        R$ {payload[0].value.toLocaleString("pt-BR")}
      </p>
    </div>
  );
}

interface RevenueChartProps {
  data: Record<RevenueGranularity, RevenuePoint[]>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [granularity, setGranularity] = useState<RevenueGranularity>("diario");
  const chartData = data[granularity];

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-medium text-foreground">Faturamento ao longo do tempo</h2>
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as RevenueGranularity)}
          className={cn(
            "h-8 rounded-md border border-border-subtle bg-surface-inset px-2 text-[11px] text-muted-foreground",
            "focus:outline-none focus:ring-1 focus:ring-white/10"
          )}
        >
          {GRANULARITY_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="reportsRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(250,250,250,0.1)" />
                <stop offset="100%" stopColor="rgba(250,250,250,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#fafafa"
              strokeWidth={2}
              fill="url(#reportsRevenueGradient)"
              dot={false}
              isAnimationActive={false}
              activeDot={{ r: 3, fill: "#fafafa", stroke: "#09090b", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueComparisonPoint } from "@/lib/mock-data/relatorios-types";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border-subtle bg-surface-elevated px-3 py-2 shadow-xl">
      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-xs tabular-nums text-foreground">
          {item.name}: R$ {item.value.toLocaleString("pt-BR")}
        </p>
      ))}
    </div>
  );
}

interface RevenueComparisonProps {
  data: RevenueComparisonPoint[];
}

export function RevenueComparison({ data }: RevenueComparisonProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-medium text-foreground">Receitas vs Despesas</h2>
        <select className="h-8 rounded-md border border-border-subtle bg-surface-inset px-2 text-[11px] text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10">
          <option>Mensal</option>
          <option>Trimestral</option>
        </select>
      </div>
      <div className="flex-1 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barGap={2}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="receitas" name="Receitas" fill="#fafafa" radius={[2, 2, 0, 0]} maxBarSize={16} isAnimationActive={false} />
            <Bar dataKey="despesas" name="Despesas" fill="#52525b" radius={[2, 2, 0, 0]} maxBarSize={16} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-subtle">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-foreground" />
          <span className="text-[10px] text-muted-foreground">Receitas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#52525b]" />
          <span className="text-[10px] text-muted-foreground">Despesas</span>
        </div>
      </div>
    </div>
  );
}

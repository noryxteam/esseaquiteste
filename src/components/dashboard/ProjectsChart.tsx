"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProjectsChartDataPoint } from "@/lib/mock-data/types";
import { TREND_COLORS } from "@/components/dashboard/constants";
import { cn } from "@/lib/utils";

interface ProjectsChartProps {
  data: ProjectsChartDataPoint[];
  total: number;
  trend: string;
  trendDirection: "up" | "down" | "neutral";
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: ProjectsChartDataPoint }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface-elevated px-3 py-2 shadow-xl">
      <p className="text-[10px] text-muted-foreground">{payload[0].payload.semana}</p>
      <p className="text-sm font-semibold">{payload[0].value} projetos</p>
    </div>
  );
}

export function ProjectsChart({ data, total, trend, trendDirection }: ProjectsChartProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5 hover:border-border-strong transition-colors h-full flex flex-col">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Projetos finalizados</p>
        <p className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums">{total}</p>
        <p className={cn("mt-1 text-xs font-medium", TREND_COLORS[trendDirection])}>{trend} vs mês anterior</p>
      </div>
      <div className="flex-1 min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="semana" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} cursor={false} />
            <Bar dataKey="quantidade" fill="rgba(250,250,250,0.25)" radius={[4, 4, 0, 0]} isAnimationActive={false} activeBar={{ fill: "#fafafa" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

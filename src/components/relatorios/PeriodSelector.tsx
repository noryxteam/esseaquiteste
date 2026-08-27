"use client";

import { Calendar, ChevronDown } from "lucide-react";
import type { ReportPeriod } from "@/lib/mock-data/relatorios-types";
import { Button } from "@/components/ui/button-shadcn";

const PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: "maio-2024", label: "01/05/2024 — 31/05/2024" },
  { id: "abril-2024", label: "01/04/2024 — 30/04/2024" },
  { id: "marco-2024", label: "01/03/2024 — 31/03/2024" },
];

interface PeriodSelectorProps {
  value: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const current = PERIODS.find((p) => p.id === value) ?? PERIODS[0];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReportPeriod)}
        className="appearance-none h-9 pl-9 pr-8 rounded-md border border-border-subtle bg-surface-inset text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-white/10 cursor-pointer"
      >
        {PERIODS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <span className="sr-only">{current.label}</span>
    </div>
  );
}

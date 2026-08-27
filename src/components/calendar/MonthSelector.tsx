"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface MonthSelectorProps {
  value: number;
  year?: number;
  onChange: (month: number) => void;
  className?: string;
}

export function MonthSelector({ value, year, onChange, className }: MonthSelectorProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 appearance-none rounded-lg border border-border-subtle bg-surface-inset pl-3 pr-8 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-white/10"
      >
        {MONTHS.map((month, i) => (
          <option key={month} value={i}>
            {month}{year ? ` ${year}` : ""}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

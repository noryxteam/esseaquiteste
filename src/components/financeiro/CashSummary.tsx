"use client";

import { useState } from "react";
import type { CashSummaryItem } from "@/lib/mock-data/financeiro-types";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS = [
  { value: "mes", label: "Este mês" },
  { value: "mes-anterior", label: "Mês passado" },
  { value: "trimestre", label: "Este trimestre" },
  { value: "ano", label: "Este ano" },
];

interface CashSummaryProps {
  items: CashSummaryItem[];
}

export function CashSummary({ items }: CashSummaryProps) {
  const [period, setPeriod] = useState<string | null>("mes");

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-foreground">Resumo do caixa</h2>
        <FilterDropdown
          label="Período"
          options={PERIOD_OPTIONS}
          value={period}
          onChange={setPeriod}
        />
      </div>

      <ul className="space-y-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 py-2.5 border-b border-border-subtle last:border-0"
          >
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
            <span
              className={cn(
                "text-[11px] font-medium tabular-nums text-right",
                item.tone === "green" && "text-state-green",
                item.tone === "yellow" && "text-state-orange",
                item.tone === "red" && "text-state-red",
                (!item.tone || item.tone === "neutral") && "text-foreground"
              )}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GhostButton } from "@/components/buttons";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

interface MiniCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

/** Calendário compacto sem biblioteca externa. */
export function MiniCalendar({ value, onChange, className }: MiniCalendarProps) {
  const [view, setView] = useState(value ?? new Date());

  const { days, monthLabel } = useMemo(() => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const total = last.getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    const monthLabel = view.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return { days: cells, monthLabel };
  }, [view]);

  const selectedDay = value?.getDate();
  const selectedMonth = value?.getMonth();
  const selectedYear = value?.getFullYear();

  const shiftMonth = (delta: number) => {
    setView((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-3", className)}>
      <div className="flex items-center justify-between mb-3">
        <GhostButton className="h-7 w-7 p-0" onClick={() => shiftMonth(-1)} aria-label="Mês anterior">
          <ChevronLeft className="h-3.5 w-3.5" />
        </GhostButton>
        <span className="text-xs font-medium text-foreground capitalize">{monthLabel}</span>
        <GhostButton className="h-7 w-7 p-0" onClick={() => shiftMonth(1)} aria-label="Próximo mês">
          <ChevronRight className="h-3.5 w-3.5" />
        </GhostButton>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[9px] text-center text-muted-foreground">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            type="button"
            disabled={!day}
            onClick={() =>
              day &&
              onChange?.(new Date(view.getFullYear(), view.getMonth(), day))
            }
            className={cn(
              "h-7 w-7 rounded-md text-[10px] tabular-nums transition-colors",
              !day && "invisible",
              day &&
                selectedDay === day &&
                selectedMonth === view.getMonth() &&
                selectedYear === view.getFullYear()
                ? "bg-foreground text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

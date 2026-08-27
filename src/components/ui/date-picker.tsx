"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // yyyy-mm-dd
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseIso(value: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, day] = value.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== day) return null;
  return d;
}

function formatDisplay(value: string): string {
  const d = parseIso(value);
  if (!d) return "Selecionar data";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildGrid(view: Date): { date: Date; inMonth: boolean }[] {
  const year = view.getFullYear();
  const month = view.getMonth();
  const startPad = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = 0; i < startPad; i++) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - startPad + 1 + i),
      inMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  let next = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, next++), inMonth: false });
  }
  return cells;
}

/**
 * Calendário Norax — glass blur, dias arredondados (sem picker nativo).
 */
export function DatePicker({ value, onChange, className, disabled }: DatePickerProps) {
  const selected = useMemo(() => parseIso(value), [value]);
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => selected ?? today);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setView(selected ?? today);
  }, [open, selected, today]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cells = useMemo(() => buildGrid(view), [view]);

  const prevMonth = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  const nextMonth = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));

  const pick = (d: Date) => {
    onChange(toIso(d));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border-subtle bg-surface-inset px-3 text-xs text-foreground",
          "hover:border-border focus:outline-none focus:ring-1 focus:ring-border",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        <span className={cn("tabular-nums", !selected && "text-muted-foreground")}>
          {formatDisplay(value)}
        </span>
        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 bottom-full mb-1.5 w-[280px] overflow-hidden rounded-2xl",
            "border border-white/10",
            "bg-black/40 backdrop-blur-xl backdrop-saturate-150",
            "shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
          )}
        >
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <p className="text-xs font-medium text-white capitalize">
              {MONTHS[view.getMonth()]} de {view.getFullYear()}
            </p>
            <div className="flex items-center gap-0.5">
              <NavBtn onClick={prevMonth} label="Mês anterior">
                <ChevronLeft className="h-3.5 w-3.5" />
              </NavBtn>
              <NavBtn onClick={nextMonth} label="Próximo mês">
                <ChevronRight className="h-3.5 w-3.5" />
              </NavBtn>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0.5 px-2.5 pb-1">
            {WEEKDAYS.map((d, i) => (
              <div
                key={`${d}-${i}`}
                className="h-7 flex items-center justify-center text-[10px] text-white/40 font-medium"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 px-2.5 pb-2">
            {cells.map(({ date, inMonth }) => {
              const isSelected = selected ? sameDay(date, selected) : false;
              const isToday = sameDay(date, today);

              return (
                <button
                  key={toIso(date)}
                  type="button"
                  onClick={() => pick(date)}
                  className={cn(
                    "h-8 w-full flex items-center justify-center text-xs tabular-nums rounded-full transition-colors",
                    !inMonth && "text-white/25",
                    inMonth && !isSelected && "text-white/75 hover:bg-white/10 hover:text-white",
                    isToday && !isSelected && "ring-1 ring-white/25 text-white",
                    isSelected &&
                      "bg-white text-black font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.25)]"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-[11px] text-white/50 hover:text-white/90 transition-colors"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => pick(today)}
              className="text-[11px] text-white/70 hover:text-white transition-colors rounded-full px-2 py-0.5 hover:bg-white/10"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="h-7 w-7 inline-flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </button>
  );
}

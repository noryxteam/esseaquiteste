"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseTime(value: string): { h: number; m: number } {
  const [hs, ms] = (value || "12:00").split(":");
  const h = Math.min(23, Math.max(0, Number(hs) || 0));
  const m = Math.min(59, Math.max(0, Number(ms) || 0));
  return { h, m };
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

/**
 * Seletor de hora Norax — glass blur, seleção arredondada (sem picker nativo).
 */
export function TimePicker({ value, onChange, className, disabled }: TimePickerProps) {
  const { h, m } = useMemo(() => parseTime(value), [value]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const scrollSelected = (el: HTMLDivElement | null, index: number) => {
      if (!el) return;
      const item = el.children[index] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "center", behavior: "auto" });
    };
    const t = window.requestAnimationFrame(() => {
      scrollSelected(hourRef.current, h);
      scrollSelected(minuteRef.current, m);
    });
    return () => window.cancelAnimationFrame(t);
  }, [open, h, m]);

  const setHour = (hour: number) => onChange(`${pad(hour)}:${pad(m)}`);
  const setMinute = (minute: number) => onChange(`${pad(h)}:${pad(minute)}`);

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
        <span className="tabular-nums">
          {pad(h)}:{pad(m)}
        </span>
        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 bottom-full mb-1.5 w-full min-w-[148px] overflow-hidden rounded-2xl",
            "border border-white/10",
            "bg-black/40 backdrop-blur-xl backdrop-saturate-150",
            "shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
          )}
        >
          <div className="grid grid-cols-2 divide-x divide-white/10">
            <WheelColumn
              ref={hourRef}
              items={HOURS}
              selected={h}
              onSelect={setHour}
              accent="hour"
            />
            <WheelColumn
              ref={minuteRef}
              items={MINUTES}
              selected={m}
              onSelect={setMinute}
              accent="minute"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const WheelColumn = forwardRef<
  HTMLDivElement,
  {
    items: number[];
    selected: number;
    onSelect: (n: number) => void;
    accent: "hour" | "minute";
  }
>(function WheelColumn({ items, selected, onSelect, accent }, ref) {
  return (
    <div
      ref={ref}
      className="max-h-[196px] overflow-y-auto overscroll-contain py-2 px-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((n) => {
        const active = n === selected;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(n)}
            className={cn(
              "flex w-full items-center justify-center my-0.5 h-8 text-xs tabular-nums transition-colors rounded-full",
              !active && "text-white/55 hover:text-white/90 hover:bg-white/5",
              active &&
                accent === "hour" &&
                "bg-white text-black font-medium shadow-[0_0_0_1px_rgba(255,255,255,0.25)]",
              active &&
                accent === "minute" &&
                "bg-white/20 text-white font-medium ring-1 ring-white/30"
            )}
          >
            {pad(n)}
          </button>
        );
      })}
    </div>
  );
});

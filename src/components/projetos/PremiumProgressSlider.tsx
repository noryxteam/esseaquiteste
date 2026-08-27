"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PremiumProgressSliderProps {
  value: number;
  onCommit: (value: number) => void;
  disabled?: boolean;
  className?: string;
  /** Mostra 0% / 100% nas extremidades */
  showEnds?: boolean;
}

/**
 * Slider premium estilo YouTube/Spotify — arrasta livremente 0–100.
 * Commit apenas no pointerup (autosave).
 */
export function PremiumProgressSlider({
  value,
  onCommit,
  disabled = false,
  className,
  showEnds = true,
}: PremiumProgressSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [local, setLocal] = useState(value);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!draggingRef.current) {
      setLocal(value);
    }
  }, [value]);

  const valueFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(100, Math.max(0, Math.round(ratio * 100)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    setLocal(valueFromClientX(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || disabled) return;
    setLocal(valueFromClientX(e.clientX));
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
    const next = valueFromClientX(e.clientX);
    setLocal(next);
    if (next !== value) {
      onCommit(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    let next = local;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(100, local + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, local - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    else if (e.key === "PageUp") next = Math.min(100, local + 5);
    else if (e.key === "PageDown") next = Math.max(0, local - 5);
    else return;
    e.preventDefault();
    setLocal(next);
    onCommit(next);
  };

  const active = hovering || dragging;
  const pct = `${local}%`;

  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] text-muted-foreground">Progresso geral</p>
        <span
          className={cn(
            "text-sm font-medium tabular-nums text-foreground transition-transform duration-150",
            dragging && "scale-110"
          )}
        >
          {local}%
        </span>
      </div>

      <div
        className={cn(
          "group relative py-3 outline-none",
          disabled && "opacity-50 pointer-events-none"
        )}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={local}
        aria-label="Progresso do projeto"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          if (!draggingRef.current) setHovering(false);
        }}
      >
        {showEnds && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between text-[9px] text-muted-foreground/70 tabular-nums">
            <span>0%</span>
            <span>100%</span>
          </div>
        )}

        <div
          ref={trackRef}
          className="relative h-7 flex items-center cursor-pointer touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* Track base */}
          <div
            className={cn(
              "absolute inset-x-0 h-[3px] rounded-full bg-white/[0.12] transition-[height] duration-150",
              active && "h-[4px]"
            )}
          />
          {/* Fill */}
          <div
            className={cn(
              "absolute left-0 h-[3px] rounded-full bg-white transition-[height,width] duration-75 ease-out",
              active && "h-[4px]"
            )}
            style={{ width: pct }}
          />
          {/* Thumb */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.45)]",
              "transition-[width,height,box-shadow] duration-150 ease-out will-change-transform",
              active
                ? "h-3.5 w-3.5 shadow-[0_0_0_4px_rgba(250,250,250,0.12),0_2px_10px_rgba(0,0,0,0.5)]"
                : "h-2.5 w-2.5"
            )}
            style={{ left: pct }}
          />
        </div>
      </div>

      {!disabled && (
        <p className="text-[10px] text-muted-foreground/80 mt-0.5">
          Arraste a bolinha — salva ao soltar.
        </p>
      )}
    </div>
  );
}

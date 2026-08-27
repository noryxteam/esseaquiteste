"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GhostButton } from "@/components/buttons";

interface DateSelectorProps {
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  isToday?: boolean;
  className?: string;
}

export function DateSelector({ label, onPrev, onNext, onToday, isToday, className }: DateSelectorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <GhostButton className="h-8 w-8 p-0" onClick={onPrev} aria-label="Anterior">
        <ChevronLeft className="h-4 w-4" />
      </GhostButton>
      <button
        type="button"
        onClick={onToday}
        className={cn(
          "min-w-[120px] text-center text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
          isToday ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
      </button>
      <GhostButton className="h-8 w-8 p-0" onClick={onNext} aria-label="Próximo">
        <ChevronRight className="h-4 w-4" />
      </GhostButton>
    </div>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  isToday?: boolean;
}

export function DateSelector({
  label,
  onPrev,
  onNext,
  onToday,
  isToday = true,
}: DateSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md border border-border-subtle bg-surface/40">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onPrev}
          aria-label="Dia anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-2 text-xs font-medium text-foreground tabular-nums min-w-[100px] text-center">
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onNext}
          aria-label="Próximo dia"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToday}
        className={cn(
          "h-8 px-3 text-xs border-border-subtle",
          isToday
            ? "bg-surface-elevated text-foreground"
            : "bg-surface/40 text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        )}
      >
        Hoje
      </Button>
    </div>
  );
}

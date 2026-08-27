"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface ContractZoomProps {
  zoom: number;
  fitWidth: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitWidth: () => void;
  compact?: boolean;
  className?: string;
}

export function ContractZoom({
  zoom,
  fitWidth,
  onZoomIn,
  onZoomOut,
  onFitWidth,
  compact,
  className,
}: ContractZoomProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1 rounded-md border border-border-subtle p-0.5">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomOut}>
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums w-10 text-center">{zoom}%</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomIn}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {!compact && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFitWidth}
          className={cn(
            "h-8 text-[11px] text-muted-foreground hover:text-foreground",
            fitWidth && "bg-surface-elevated text-foreground"
          )}
        >
          Ajustar largura
        </Button>
      )}
    </div>
  );
}

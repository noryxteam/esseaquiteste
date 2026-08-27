"use client";

import type { ContractTimelineEntry } from "@/modules/electronic-contracts";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractTimelineProps {
  events: ContractTimelineEntry[];
  className?: string;
}

export function ContractTimeline({ events, className }: ContractTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {events.map((event, i) => (
        <div key={event.id} className="flex gap-3 pb-4 last:pb-0">
          <div className="flex flex-col items-center">
            <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center shrink-0">
              <Check className="h-3 w-3 text-accent-foreground" />
            </div>
            {i < events.length - 1 && <div className="w-px flex-1 bg-border-subtle mt-1" />}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-foreground">{event.titulo}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{event.descricao}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">
              {event.data} às {event.hora} — {event.usuario}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

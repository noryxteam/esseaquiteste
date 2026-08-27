"use client";

import type { SecurityTimelineEvent } from "@/modules/security/types";
import { cn } from "@/lib/utils";

interface SecurityTimelineProps {
  events: SecurityTimelineEvent[];
}

export function SecurityTimeline({ events }: SecurityTimelineProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Linha do tempo de segurança</h3>
      <p className="text-[10px] text-muted-foreground">Visível apenas para a equipe interna da Norax.</p>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border-subtle rounded-lg">
          Nenhum evento registrado.
        </p>
      ) : (
        <div className="rounded-lg border border-border-subtle divide-y divide-border-subtle max-h-80 overflow-y-auto">
          {events.map((event, i) => (
            <div key={event.id} className="px-4 py-3 flex gap-3">
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className={cn("h-2 w-2 rounded-full", i === 0 ? "bg-foreground" : "bg-muted-foreground/40")} />
                {i < events.length - 1 && <div className="w-px flex-1 bg-border-subtle mt-1" />}
              </div>
              <div className="min-w-0 flex-1 pb-2">
                <p className="text-xs font-medium">{event.typeLabel}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{event.description}</p>
                <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                  {event.date}
                  {event.user && ` · ${event.user}`}
                  {event.device && ` · ${event.device}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

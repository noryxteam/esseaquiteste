import type { ContractHistoryEvent } from "@/lib/mock-data/contract-document-types";
import { cn } from "@/lib/utils";

interface ContractHistoryProps {
  events: ContractHistoryEvent[];
  className?: string;
}

export function ContractHistory({ events, className }: ContractHistoryProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center shrink-0">
            <div className="h-2 w-2 rounded-full bg-white/30 mt-1.5" />
            {index < events.length - 1 && <div className="w-px flex-1 bg-border-subtle my-1 min-h-[24px]" />}
          </div>
          <div className="pb-4 min-w-0">
            <p className="text-xs font-medium text-foreground">{event.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{event.responsible}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 tabular-nums">
              {event.date} · {event.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

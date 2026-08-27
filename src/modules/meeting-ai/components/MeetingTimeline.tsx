import type { MeetingTimelineEvent } from "@/modules/meeting-ai/types";
import { cn } from "@/lib/utils";

interface MeetingTimelineProps {
  events: MeetingTimelineEvent[];
  className?: string;
}

export function MeetingTimeline({ events, className }: MeetingTimelineProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4", className)}>
      <h3 className="text-xs font-medium text-foreground mb-4">Timeline da reunião</h3>
      <ul className="space-y-0">
        {events.map((event, i) => (
          <li key={event.id} className="grid grid-cols-[48px_12px_1fr] gap-x-3">
            <span className="text-[10px] tabular-nums text-muted-foreground pt-0.5">{event.time}</span>
            <div className="flex flex-col items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 shrink-0 mt-1.5" />
              {i < events.length - 1 && <div className="w-px flex-1 bg-border-subtle min-h-[20px] mt-1" />}
            </div>
            <p className="text-xs text-muted-foreground pb-3">{event.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

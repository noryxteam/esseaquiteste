import { cn } from "@/lib/utils";
import type { TimelineItemData } from "@/components/timeline";
import { Timeline } from "@/components/timeline";

interface TimelineCalendarProps {
  date: string;
  events: TimelineItemData[];
  className?: string;
}

/** Combina data + timeline de eventos do dia. */
export function TimelineCalendar({ date, events, className }: TimelineCalendarProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4", className)}>
      <p className="text-xs font-medium text-foreground mb-4">{date}</p>
      <Timeline items={events} />
    </div>
  );
}

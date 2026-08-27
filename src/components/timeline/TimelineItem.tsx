import { cn } from "@/lib/utils";
import type { TimelineItemData } from "./Timeline";

interface TimelineItemProps {
  item: TimelineItemData;
  isLast?: boolean;
}

export function TimelineItem({ item, isLast }: TimelineItemProps) {
  const Icon = item.icon;

  return (
    <div className="grid grid-cols-[56px_16px_1fr] gap-x-3">
      <span className="text-[10px] tabular-nums text-muted-foreground text-right pt-0.5">{item.time}</span>
      <div className="relative flex flex-col items-center">
        <span
          className={cn(
            "h-2 w-2 rounded-full shrink-0 mt-1.5 z-10",
            item.status === "active" && "bg-foreground",
            item.status === "completed" && "bg-foreground/60",
            item.status === "pending" && "border border-border-strong bg-transparent",
            (!item.status || item.status === "default") && "bg-foreground/40"
          )}
        />
        {!isLast && <div className="w-px flex-1 bg-border-subtle min-h-[24px] mt-1" />}
      </div>
      <div className={cn("pb-4", isLast && "pb-0")}>
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="h-3 w-3 text-muted-foreground" />}
          <p className="text-xs font-medium text-foreground">{item.title}</p>
        </div>
        {item.description && (
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { BaseCard } from "@/components/common/BaseCard";
import type { TimelineItemData } from "./Timeline";
import { TimelineItem } from "./TimelineItem";

interface TimelineCardProps {
  title: string;
  items: TimelineItemData[];
  className?: string;
}

export function TimelineCard({ title, items, className }: TimelineCardProps) {
  return (
    <BaseCard className={className} header={<h3 className="text-sm font-medium text-foreground">{title}</h3>}>
      <div className="space-y-0">
        {items.map((item, i) => (
          <TimelineItem key={item.id} item={item} isLast={i === items.length - 1} />
        ))}
      </div>
    </BaseCard>
  );
}

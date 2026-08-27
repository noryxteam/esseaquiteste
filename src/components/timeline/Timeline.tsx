import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TimelineItem } from "./TimelineItem";

export interface TimelineItemData {
  id: string;
  time: string;
  title: string;
  description?: string;
  status?: "default" | "active" | "completed" | "pending";
  icon?: LucideIcon;
}

interface TimelineProps {
  items: TimelineItemData[];
  className?: string;
}

/** Timeline vertical reutilizável — contratos, reuniões, financeiro, projetos. */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {items.map((item, i) => (
        <TimelineItem key={item.id} item={item} isLast={i === items.length - 1} />
      ))}
    </div>
  );
}

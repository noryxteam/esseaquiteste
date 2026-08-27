"use client";

import {
  ArrowDownLeft,
  CheckCircle2,
  FileCheck,
  FileText,
  Send,
  type LucideIcon,
} from "lucide-react";
import type { RecentActivityItem } from "@/lib/mock-data/relatorios-types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  FileCheck,
  ArrowDownLeft,
  CheckCircle2,
  FileText,
  Send,
};

interface RecentActivityProps {
  items: RecentActivityItem[];
  onItemClick?: (item: RecentActivityItem) => void;
}

export function RecentActivity({ items, onItemClick }: RecentActivityProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5">
      <h2 className="text-sm font-medium text-foreground mb-4">Atividades recentes</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? FileText;
          return (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={cn(
                "shrink-0 w-[180px] rounded-md border border-border-subtle bg-surface-inset/50 p-3 hover:border-border hover:bg-surface-hover/40 transition-colors",
                onItemClick && "cursor-pointer"
              )}
            >
              <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center mb-2">
                <Icon className="h-3.5 w-3.5 text-foreground/70" />
              </div>
              <p className="text-xs font-medium text-foreground">{item.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.description}</p>
              <p className="text-[9px] text-muted-foreground/70 mt-2">{item.date}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import type { PendingItem } from "@/lib/mock-data/types";
import { STAT_COLORS } from "@/components/dashboard/constants";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface PendingListProps {
  items: PendingItem[];
}

export function PendingList({ items }: PendingListProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5 hover:border-border-strong transition-colors h-full flex flex-col">
      <p className="text-sm font-medium text-foreground mb-4">Pendências</p>
      <ul className="flex-1 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 group">
            <span className="text-sm text-muted-foreground group-hover:text-foreground-secondary transition-colors truncate">
              {item.title}
            </span>
            <span
              className={cn(
                "shrink-0 min-w-[24px] h-6 px-2 rounded-md text-xs font-semibold flex items-center justify-center tabular-nums",
                STAT_COLORS[item.color].badge
              )}
            >
              {item.count}
            </span>
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="mt-4 w-full justify-between text-muted-foreground hover:text-foreground text-xs h-9">
        Ver todas pendências
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

"use client";

import type { ChecklistItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChecklistProps {
  items: ChecklistItem[];
  onToggle?: (id: string) => void;
}

export function Checklist({ items, onToggle }: ChecklistProps) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onToggle?.(item.id)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-all duration-150",
              "hover:bg-surface-hover focus-ring",
              item.highlighted && "bg-accent-subtle border border-border-strong",
              item.done && "opacity-50"
            )}
          >
            <span
              className={cn(
                "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-150",
                item.done
                  ? "bg-foreground border-foreground text-accent-foreground"
                  : "border-border-strong hover:border-muted"
              )}
            >
              {item.done && <Check className="h-3 w-3" strokeWidth={2.5} />}
            </span>
            <span className={cn("leading-snug", item.done && "line-through text-muted-foreground")}>
              {item.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

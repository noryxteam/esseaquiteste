"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  badge?: string;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  actions,
  children,
  id,
  badge,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} className="border-b border-border-subtle py-3.5 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex flex-1 items-center gap-2 text-left group focus-ring rounded-md -ml-1 pl-1"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
              !open && "-rotate-90"
            )}
          />
          <span className="text-[13px] font-medium text-foreground-secondary group-hover:text-foreground transition-colors">
            {title}
          </span>
          {badge && (
            <span className="text-[10px] font-medium text-muted-foreground bg-surface-elevated px-1.5 py-0.5 rounded border border-border">
              {badge}
            </span>
          )}
        </button>
        {actions && open && <div className="flex shrink-0 gap-1.5">{actions}</div>}
      </div>
      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

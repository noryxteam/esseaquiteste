"use client";

import { TabUnderline } from "@/components/ui/tab-underline";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  disabled?: boolean;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
  underline?: boolean;
}

export function Tabs<T extends string = string>({
  items,
  active,
  onChange,
  className,
  underline = true,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-5 sm:gap-6 overflow-x-auto",
        underline && "border-b border-border-subtle",
        className
      )}
    >
      {items.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative pb-3 text-xs font-medium whitespace-nowrap transition-colors duration-150",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              tab.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            {tab.label}
            {underline && isActive && <TabUnderline />}
          </button>
        );
      })}
    </div>
  );
}

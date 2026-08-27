"use client";

import { cn } from "@/lib/utils";

interface FilterChipsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterChips({ options, active, onChange, className }: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-md px-2.5 py-1 text-[12px] font-medium transition-all duration-150",
            "border focus-ring",
            active === option
              ? "bg-accent-subtle border-border-strong text-foreground"
              : "border-transparent text-muted-foreground hover:text-muted hover:bg-surface-hover"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

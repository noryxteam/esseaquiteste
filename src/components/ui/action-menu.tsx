"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

export interface ActionMenuItem {
  id: string;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  icon?: "vertical" | "horizontal";
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export function ActionMenu({ items, icon = "vertical", className, onOpenChange }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        onOpenChange?.(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [open, onOpenChange]);

  const Icon = icon === "horizontal" ? MoreHorizontal : MoreVertical;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => {
            onOpenChange?.(!v);
            return !v;
          });
        }}
        aria-label="Mais opções"
        aria-expanded={open}
      >
        <Icon className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-lg border border-border-subtle bg-background shadow-lg py-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onOpenChange?.(false);
                item.onClick();
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-xs transition-colors disabled:opacity-50",
                item.destructive
                  ? "text-state-red hover:bg-state-red/10"
                  : "text-foreground hover:bg-surface-hover"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

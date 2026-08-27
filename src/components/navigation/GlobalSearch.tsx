"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

export interface GlobalSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
  shortcut?: string;
  onShortcutClick?: () => void;
}

export const GlobalSearch = React.forwardRef<HTMLInputElement, GlobalSearchProps>(
  (
    {
      className,
      containerClassName,
      placeholder = "Buscar clientes, projetos, arquivos...",
      shortcut = "⌘K",
      onShortcutClick,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative flex-1 max-w-2xl", containerClassName)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn("pl-9 pr-16 h-10 bg-surface border-border-subtle", className)}
          {...props}
        />
        {shortcut && (
          <button
            type="button"
            onClick={onShortcutClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-surface-elevated px-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
            aria-label={`Atalho de busca: ${shortcut}`}
          >
            {shortcut}
          </button>
        )}
      </div>
    );
  }
);
GlobalSearch.displayName = "GlobalSearch";

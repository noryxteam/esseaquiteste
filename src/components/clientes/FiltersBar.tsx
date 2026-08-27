"use client";

import {
  Filter,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

interface FiltersBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
}

export function FiltersBar({
  query,
  onQueryChange,
  view,
  onViewChange,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar clientes..."
          className="pl-9 h-9 text-xs bg-surface-inset border-border-subtle"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40 hover:bg-surface-hover hover:text-foreground"
        >
          <Filter className="h-3.5 w-3.5" />
          Mais filtros
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center rounded-md border border-border-subtle p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={cn(
              "p-1.5 rounded transition-colors",
              view === "grid" ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={cn(
              "p-1.5 rounded transition-colors",
              view === "list" ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

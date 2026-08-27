"use client";

import {
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { cn } from "@/lib/utils";

const STAGE_OPTIONS = [
  { value: "desenvolvimento", label: "Desenvolvimento" },
  { value: "design", label: "Design" },
  { value: "qa", label: "QA" },
];

const SORT_OPTIONS = [
  { value: "date", label: "Data" },
  { value: "dueDate", label: "Entrega" },
  { value: "progress", label: "Progresso" },
];

interface ProjectFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  stageFilter: string | null;
  onStageFilterChange: (value: string | null) => void;
  sortBy: string | null;
  onSortByChange: (value: string | null) => void;
}

export function ProjectFilters({
  query,
  onQueryChange,
  view,
  onViewChange,
  stageFilter,
  onStageFilterChange,
  sortBy,
  onSortByChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
      <div className="relative flex-1 sm:max-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Pesquisar projetos..."
          className="pl-9 h-9 text-xs bg-surface-inset border-border-subtle"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        <FilterDropdown
          label="Filtros"
          options={STAGE_OPTIONS}
          value={stageFilter}
          onChange={onStageFilterChange}
        />

        <div className="flex items-center rounded-md border border-border-subtle p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={cn(
              "p-1.5 rounded transition-colors",
              view === "grid" ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Visualização em grade"
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
            aria-label="Visualização em lista"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>

        <FilterDropdown
          label="Ordenar"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={onSortByChange}
        />
      </div>
    </div>
  );
}

"use client";

import { Filter, LayoutGrid, List, User } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { DateSelector } from "@/components/reunioes/DateSelector";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { cn } from "@/lib/utils";

interface MeetingFiltersProps {
  dateLabel: string;
  isToday: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  typeFilter: string | null;
  onTypeFilterChange: (value: string | null) => void;
  leadFilter: string | null;
  onLeadFilterChange: (value: string | null) => void;
  typeOptions: { value: string; label: string }[];
  leadOptions: { value: string; label: string }[];
  onMoreFilters?: () => void;
}

export function MeetingFilters({
  dateLabel,
  isToday,
  onPrevDay,
  onNextDay,
  onToday,
  view,
  onViewChange,
  typeFilter,
  onTypeFilterChange,
  leadFilter,
  onLeadFilterChange,
  typeOptions,
  leadOptions,
  onMoreFilters,
}: MeetingFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <DateSelector
        label={dateLabel}
        isToday={isToday}
        onPrev={onPrevDay}
        onNext={onNextDay}
        onToday={onToday}
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Tipo"
          options={typeOptions}
          value={typeFilter}
          onChange={onTypeFilterChange}
        />
        <FilterDropdown
          label="Responsável"
          options={leadOptions}
          value={leadFilter}
          onChange={onLeadFilterChange}
        />
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onMoreFilters}
          className="h-8 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40 hover:bg-surface-hover hover:text-foreground"
        >
          <Filter className="h-3.5 w-3.5" />
          Mais filtros
        </Button>

        <div className="flex items-center rounded-md border border-border-subtle p-0.5 ml-0 lg:ml-2">
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
      </div>
    </div>
  );
}

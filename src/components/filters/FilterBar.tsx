"use client";

import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

export interface FilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  onFilterClick?: () => void;
  filterLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  search,
  onFilterClick,
  filterLabel = "Filtrar",
  children,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {children && (
          <div className="flex items-center gap-2 overflow-x-auto">{children}</div>
        )}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {onFilterClick && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40"
              onClick={onFilterClick}
            >
              <Filter className="h-3.5 w-3.5" />
              {filterLabel}
            </Button>
          )}
          {search && (
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder ?? "Buscar..."}
                className="pl-8 h-8 text-xs bg-surface-inset border-border-subtle"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  count?: number;
  className?: string;
}

export function FilterChip({
  label,
  active = false,
  onClick,
  onRemove,
  count,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition-all duration-150 border focus-ring",
        active
          ? "bg-accent-subtle border-border-strong text-foreground"
          : "border-transparent text-muted-foreground hover:text-muted hover:bg-surface-hover",
        className
      )}
    >
      {label}
      {count != null && (
        <span className="text-[10px] tabular-nums text-muted-foreground">({count})</span>
      )}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="ml-0.5 hover:text-foreground"
          aria-label={`Remover filtro ${label}`}
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

export interface FilterGroupOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroupProps {
  label?: string;
  options: FilterGroupOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function FilterGroup({
  label,
  options,
  value,
  onChange,
  multiple = false,
  className,
}: FilterGroupProps) {
  const isActive = (optionValue: string) =>
    multiple
      ? Array.isArray(value) && value.includes(optionValue)
      : value === optionValue;

  const handleClick = (optionValue: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      onChange(
        current.includes(optionValue)
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue]
      );
    } else {
      onChange(value === optionValue ? "" : optionValue);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            count={option.count}
            active={isActive(option.value)}
            onClick={() => handleClick(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

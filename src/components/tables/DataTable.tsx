"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface DataTableSort {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableFilter {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
}

export interface RowMenuItem<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  divider?: boolean;
}

export interface StatusConfig {
  label: string;
  variant?: "default" | "blue" | "green" | "orange" | "red" | "purple";
}

export interface AvatarConfig {
  initials: string;
  name?: string;
  subtitle?: string;
}

export interface BadgeConfig {
  label: string;
  variant?: "default" | "blue" | "green" | "orange" | "red" | "purple";
}

export type ColumnType = "text" | "status" | "avatar" | "badge" | "actions" | "menu" | "custom";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor?: keyof T | ((row: T) => unknown);
  type?: ColumnType;
  sortable?: boolean;
  width?: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
  getStatus?: (row: T) => StatusConfig;
  getAvatar?: (row: T) => AvatarConfig;
  getBadge?: (row: T) => BadgeConfig;
  actions?: RowAction<T>[];
  menuItems?: (row: T) => RowMenuItem<T>[];
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: DataTableColumn<T>[];
  data: T[];
  pagination?: DataTablePagination;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  sort?: {
    value: DataTableSort | null;
    onChange: (sort: DataTableSort | null) => void;
  };
  filters?: DataTableFilter[];
  onFilterChange?: (filterId: string, value: string) => void;
  selection?: {
    selected: (string | number)[];
    onChange: (selected: (string | number)[]) => void;
  };
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string | number;
}

function getCellValue<T>(row: T, column: DataTableColumn<T>): unknown {
  if (!column.accessor) return null;
  if (typeof column.accessor === "function") return column.accessor(row);
  return row[column.accessor];
}

function TableAvatar({ config }: { config: AvatarConfig }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        title={config.name}
        className="h-7 w-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-medium text-foreground/80 shrink-0"
      >
        {config.initials}
      </div>
      <div className="min-w-0">
        {config.name && (
          <p className="text-xs font-medium text-foreground truncate">{config.name}</p>
        )}
        {config.subtitle && (
          <p className="text-[10px] text-muted-foreground truncate">{config.subtitle}</p>
        )}
      </div>
    </div>
  );
}

function RowMenu<T>({ items, row }: { items: RowMenuItem<T>[]; row: T }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Menu"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-border bg-surface-elevated py-1 shadow-xl">
            {items.map((item, i) => (
              <div key={i}>
                {item.divider && <div className="my-1 border-t border-border-subtle" />}
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors",
                    item.variant === "danger"
                      ? "text-state-red hover:bg-red-500/10"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick(row);
                    setOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function renderCell<T>(row: T, column: DataTableColumn<T>, index: number) {
  if (column.render) return column.render(row, index);

  switch (column.type) {
    case "status": {
      const status = column.getStatus?.(row);
      if (!status) return null;
      return <StatusBadge label={status.label} variant={status.variant} />;
    }
    case "avatar": {
      const avatar = column.getAvatar?.(row);
      if (!avatar) return null;
      return <TableAvatar config={avatar} />;
    }
    case "badge": {
      const badge = column.getBadge?.(row);
      if (!badge) return null;
      return <StatusBadge label={badge.label} variant={badge.variant} />;
    }
    case "actions": {
      const actions = column.actions ?? [];
      return (
        <div className="flex items-center gap-1">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 text-xs",
                action.variant === "danger" && "text-state-red hover:text-state-red"
              )}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      );
    }
    case "menu": {
      const items = column.menuItems?.(row) ?? [];
      return <RowMenu items={items} row={row} />;
    }
    default: {
      const value = getCellValue(row, column);
      return (
        <span className="text-xs text-foreground truncate">
          {value != null ? String(value) : "—"}
        </span>
      );
    }
  }
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pagination,
  search,
  sort,
  filters,
  onFilterChange,
  selection,
  emptyMessage = "Nenhum registro encontrado.",
  className,
  rowClassName,
  onRowClick,
  getRowId = (row) => row.id,
}: DataTableProps<T>) {
  const allIds = useMemo(() => data.map(getRowId), [data, getRowId]);
  const allSelected =
    selection && allIds.length > 0 && allIds.every((id) => selection.selected.includes(id));
  const someSelected =
    selection && allIds.some((id) => selection.selected.includes(id)) && !allSelected;

  const toggleAll = () => {
    if (!selection) return;
    selection.onChange(allSelected ? [] : allIds);
  };

  const toggleRow = (id: string | number) => {
    if (!selection) return;
    const next = selection.selected.includes(id)
      ? selection.selected.filter((s) => s !== id)
      : [...selection.selected, id];
    selection.onChange(next);
  };

  const handleSort = (columnId: string) => {
    if (!sort) return;
    if (sort.value?.columnId === columnId) {
      if (sort.value.direction === "asc") {
        sort.onChange({ columnId, direction: "desc" });
      } else {
        sort.onChange(null);
      }
    } else {
      sort.onChange({ columnId, direction: "asc" });
    }
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <div className={cn("rounded-xl border border-border bg-surface overflow-hidden", className)}>
      {(search || filters?.length) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-border-subtle bg-surface/40">
          {search && (
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder ?? "Buscar..."}
                className="pl-8 h-8 text-xs bg-surface-inset border-border-subtle"
              />
            </div>
          )}
          {filters && filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <div key={filter.id} className="relative">
                  <select
                    value={filter.value ?? ""}
                    onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
                    className="h-8 appearance-none rounded-md border border-border-subtle bg-surface-inset pl-2.5 pr-7 text-[11px] text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10"
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-surface-inset text-left">
              {selection && (
                <th className="w-10 px-4 py-2.5">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={toggleAll}
                    aria-label="Selecionar todos"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    "px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                    column.sortable && "cursor-pointer select-none hover:text-foreground",
                    column.className
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <span className="inline-flex items-center gap-1">
                    {column.header}
                    {column.sortable && sort?.value?.columnId === column.id && (
                      sort.value.direction === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selection ? 1 : 0)}
                  className="px-4 py-12 text-center text-xs text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = selection?.selected.includes(rowId);
                return (
                  <tr
                    key={String(rowId)}
                    className={cn(
                      "border-b border-border-subtle last:border-0 transition-colors",
                      (onRowClick || isSelected) && "cursor-pointer",
                      isSelected ? "bg-accent-subtle/30" : "hover:bg-surface-hover/40",
                      rowClassName?.(row)
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selection && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRow(rowId)}
                          aria-label="Selecionar linha"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.id} className={cn("px-4 py-3", column.className)}>
                        {renderCell(row, column, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-border-subtle bg-surface/40">
          <p className="text-[11px] text-muted-foreground tabular-nums">
            {selection && selection.selected.length > 0 && (
              <span className="mr-3 text-foreground">
                {selection.selected.length} selecionado(s)
              </span>
            )}
            {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{" "}
            {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            {pagination.onPageSizeChange && (
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                className="h-7 rounded-md border border-border-subtle bg-surface-inset px-2 text-[11px] text-muted-foreground"
              >
                {(pagination.pageSizeOptions ?? [10, 25, 50]).map((size) => (
                  <option key={size} value={size}>
                    {size}/página
                  </option>
                ))}
              </select>
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-border-subtle"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[11px] text-muted-foreground tabular-nums min-w-[60px] text-center">
              {pagination.page} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-border-subtle"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Select, type SelectOption, type SelectProps } from "./Select";
import { cn } from "@/lib/utils";

export interface StatusOption extends SelectOption {
  dot?: boolean;
}

const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  { value: "ativo", label: "Ativo" },
  { value: "pendente", label: "Pendente" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
  { value: "arquivado", label: "Arquivado" },
];

export interface StatusSelectProps extends Omit<SelectProps, "options"> {
  options?: StatusOption[];
}

export function StatusSelect({
  options = DEFAULT_STATUS_OPTIONS,
  placeholder = "Status",
  size = "sm",
  className,
  ...props
}: StatusSelectProps) {
  return (
    <Select
      options={options}
      placeholder={placeholder}
      size={size}
      className={cn("min-w-[140px]", className)}
      {...props}
    />
  );
}

export interface FilterSelectProps extends Omit<SelectProps, "label"> {
  filterLabel: string;
}

export function FilterSelect({
  filterLabel,
  placeholder,
  size = "sm",
  className,
  ...props
}: FilterSelectProps) {
  return (
    <Select
      label={filterLabel}
      placeholder={placeholder ?? filterLabel}
      size={size}
      className={cn("min-w-[160px]", className)}
      {...props}
    />
  );
}

export interface ResponsibleOption extends SelectOption {
  initials?: string;
  avatar?: string;
}

export interface ResponsibleSelectProps extends Omit<SelectProps, "options"> {
  options: ResponsibleOption[];
}

export function ResponsibleSelect({
  options,
  placeholder = "Responsável",
  size = "sm",
  className,
  ...props
}: ResponsibleSelectProps) {
  return (
    <Select
      options={options.map((o) => ({
        value: o.value,
        label: o.initials ? `${o.initials} — ${o.label}` : o.label,
        disabled: o.disabled,
      }))}
      placeholder={placeholder}
      size={size}
      className={cn("min-w-[180px]", className)}
      {...props}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

const SIZE_CLASSES = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
};

export function Select({
  options,
  value,
  onChange,
  placeholder = "Selecionar...",
  label,
  disabled = false,
  className,
  size = "md",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-inset px-3 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
          SIZE_CLASSES[size]
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-surface-elevated py-1 shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors",
                option.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-surface-hover",
                value === option.value && "bg-surface-hover text-foreground"
              )}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && <Check className="h-3.5 w-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  maxDisplay?: number;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecionar...",
  label,
  disabled = false,
  className,
  maxDisplay = 2,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.filter((o) => value.includes(o.value));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
    );
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length <= maxDisplay
        ? selected.map((s) => s.label).join(", ")
        : `${selected.length} selecionados`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 h-10 rounded-lg border border-border bg-surface-inset px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>
          {displayText}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-surface-elevated py-1 shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => toggle(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                  option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-surface-hover"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center shrink-0",
                    isSelected
                      ? "bg-foreground border-foreground text-accent-foreground"
                      : "border-border-strong bg-surface-inset"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {selected.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 rounded-md bg-surface-elevated border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {item.label}
              <button
                type="button"
                onClick={() => toggle(item.value)}
                className="hover:text-foreground"
                aria-label={`Remover ${item.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

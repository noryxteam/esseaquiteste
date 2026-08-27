"use client";

import { Search, X } from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import type { NoraxInputProps } from "../common/types";
import { GhostButton } from "../buttons/GhostButton";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";

export interface SearchInputProps extends Omit<NoraxInputProps, "type"> {
  onClear?: () => void;
}

export function SearchInput({
  className,
  size = "md",
  error,
  label,
  hint,
  value,
  onClear,
  placeholder = "Buscar...",
  ...props
}: SearchInputProps) {
  const hasValue = value !== undefined && value !== "";

  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <ShadcnInput
          type="search"
          placeholder={placeholder}
          value={value}
          className={cn(
            inputSizeClass(size),
            "pl-9",
            hasValue && onClear && "pr-9",
            error && "border-state-red/50 focus-visible:ring-state-red/20",
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <GhostButton
            type="button"
            size="xs"
            aria-label="Limpar busca"
            onClick={onClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </GhostButton>
        )}
      </div>
    </InputFieldWrapper>
  );
}

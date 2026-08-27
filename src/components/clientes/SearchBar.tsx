"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";

export { NovoClienteButton } from "@/contexts/novo-cliente-context";

interface SearchBarProps {
  placeholder?: string;
  action?: React.ReactNode;
  query?: string;
  onQueryChange?: (value: string) => void;
}

export function SearchBar({
  placeholder = "Buscar clientes...",
  action,
  query,
  onQueryChange,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={onQueryChange ? (e) => onQueryChange(e.target.value) : undefined}
          placeholder={placeholder}
          className="pl-9 h-10 bg-surface-inset border-border-subtle"
        />
      </div>
      {action}
    </div>
  );
}

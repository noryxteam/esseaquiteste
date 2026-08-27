"use client";

import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";

interface SearchTranscriptProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchTranscript({ value, onChange }: SearchTranscriptProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar na transcrição..."
          className="pl-8 h-8 text-xs bg-surface-inset border-border-subtle"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-[11px] border-border-subtle text-muted-foreground bg-surface/40 shrink-0"
      >
        <Filter className="h-3.5 w-3.5" />
        Filtros
      </Button>
    </div>
  );
}

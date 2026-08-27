"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { Button } from "@/components/ui/button-shadcn";

export function SearchBar() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar contrato, cliente ou projeto..."
          className="pl-9 h-10 bg-surface-inset border-border-subtle"
        />
      </div>
      <Button className="h-10 px-4 bg-foreground text-accent-foreground hover:bg-foreground/90 shrink-0">
        + Novo contrato
      </Button>
    </div>
  );
}

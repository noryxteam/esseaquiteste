"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";

interface ContractNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function ContractNavigation({ currentPage, totalPages, onPrev, onNext }: ContractNavigationProps) {
  return (
    <div className="border-t border-border-subtle bg-[#0c0c0c] px-4 py-3 flex items-center justify-between shrink-0">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        onClick={onPrev}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Página anterior
      </Button>

      <span className="text-xs text-muted-foreground tabular-nums">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        Próxima página
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

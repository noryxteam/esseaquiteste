"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FinancialMovement } from "@/lib/mock-data/financeiro-types";
import { FinancialRow } from "@/components/financeiro/FinancialRow";
import { FinancialFilters } from "@/components/financeiro/FinancialFilters";
import type { FinancialTab } from "@/lib/mock-data/financeiro-types";
import { Button } from "@/components/ui/button-shadcn";

interface FinancialTableProps {
  movements: FinancialMovement[];
  totalCount: number;
  activeTab: FinancialTab;
  onTabChange: (tab: FinancialTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function FinancialTable({
  movements,
  totalCount,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
}: FinancialTableProps) {
  const start = (page - 1) * 8 + 1;
  const end = Math.min(page * 8, totalCount);

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-medium text-foreground mb-4">Movimentações</h2>
        <FinancialFilters
          activeTab={activeTab}
          onTabChange={onTabChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle text-left bg-surface/40">
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Data</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Descrição</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">
                Cliente / Projeto
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground hidden md:table-cell">
                Categoria
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground hidden lg:table-cell">
                Forma
              </th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Valor</th>
              <th className="px-4 py-2.5 text-[11px] font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <FinancialRow key={movement.id} movement={movement} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border-subtle">
        <p className="text-[11px] text-muted-foreground">
          Mostrando {start} a {end} de {totalCount} movimentações
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              className={`h-7 w-7 text-xs tabular-nums ${
                p === page ? "bg-surface-elevated text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

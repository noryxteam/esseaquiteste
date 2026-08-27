"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import type { FinancialTab } from "@/lib/mock-data/financeiro-types";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { TabUnderline } from "@/components/ui/tab-underline";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

const TABS: { id: FinancialTab; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "receitas", label: "Receitas" },
  { id: "despesas", label: "Despesas" },
  { id: "transferencias", label: "Transferências" },
];

const TIPO_OPTIONS = [
  { value: "recebimento", label: "Recebimento" },
  { value: "pagamento", label: "Pagamento" },
  { value: "a-receber", label: "A receber" },
  { value: "reembolso", label: "Reembolso" },
  { value: "transferencia", label: "Transferência" },
];

const CATEGORIA_OPTIONS = [
  { value: "receita", label: "Receita" },
  { value: "despesa", label: "Despesa" },
  { value: "transferencia", label: "Transferência" },
];

const FORMA_OPTIONS = [
  { value: "PIX", label: "PIX" },
  { value: "Boleto", label: "Boleto" },
  { value: "Cartão", label: "Cartão" },
  { value: "Transferência", label: "Transferência" },
];

const PERIODO_OPTIONS = [
  { value: "hoje", label: "Hoje" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mês" },
  { value: "trimestre", label: "Este trimestre" },
];

const ORDENACAO_OPTIONS = [
  { value: "data-desc", label: "Data (mais recente)" },
  { value: "data-asc", label: "Data (mais antiga)" },
  { value: "valor-desc", label: "Valor (maior)" },
  { value: "valor-asc", label: "Valor (menor)" },
];

interface FinancialFiltersProps {
  activeTab: FinancialTab;
  onTabChange: (tab: FinancialTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FinancialFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: FinancialFiltersProps) {
  const { showInfo } = useFeedback();
  const [tipoFilter, setTipoFilter] = useState<string | null>(null);
  const [categoriaFilter, setCategoriaFilter] = useState<string | null>(null);
  const [formaFilter, setFormaFilter] = useState<string | null>(null);
  const [periodoFilter, setPeriodoFilter] = useState<string | null>(null);
  const [ordenacaoFilter, setOrdenacaoFilter] = useState<string | null>(null);

  const handleFilterChange = (setter: (v: string | null) => void) => (value: string | null) => {
    setter(value);
    if (value) showInfo("Filtro aplicado.");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-6 border-b border-border-subtle overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative pb-3 text-xs font-medium whitespace-nowrap transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {isActive && <TabUnderline />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => showInfo("Painel de filtros em breve.")}
            className="h-8 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40"
          >
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </Button>
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar movimentações..."
              className="pl-8 h-8 text-xs bg-surface-inset border-border-subtle"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Tipo"
          options={TIPO_OPTIONS}
          value={tipoFilter}
          onChange={handleFilterChange(setTipoFilter)}
        />
        <FilterDropdown
          label="Categoria"
          options={CATEGORIA_OPTIONS}
          value={categoriaFilter}
          onChange={handleFilterChange(setCategoriaFilter)}
        />
        <FilterDropdown
          label="Forma de pagamento"
          options={FORMA_OPTIONS}
          value={formaFilter}
          onChange={handleFilterChange(setFormaFilter)}
        />
        <FilterDropdown
          label="Período"
          options={PERIODO_OPTIONS}
          value={periodoFilter}
          onChange={handleFilterChange(setPeriodoFilter)}
        />
        <FilterDropdown
          label="Ordenação"
          options={ORDENACAO_OPTIONS}
          value={ordenacaoFilter}
          onChange={handleFilterChange(setOrdenacaoFilter)}
        />
      </div>
    </div>
  );
}

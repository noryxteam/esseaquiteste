"use client";

import { useState } from "react";
import {
  Download,
  Filter,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { AppDrawer } from "@/components/ui/app-drawer";
import { useFeedback } from "@/contexts/feedback-context";

const STATUS_OPTIONS = [
  { value: "rascunho", label: "Rascunho" },
  { value: "aguardando-assinatura", label: "Aguardando assinatura" },
  { value: "assinado", label: "Assinado" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "arquivado", label: "Arquivado" },
];

const PERIODO_OPTIONS = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "ano", label: "Este ano" },
];

const ORDENAR_OPTIONS = [
  { value: "recente", label: "Mais recente" },
  { value: "antigo", label: "Mais antigo" },
  { value: "valor-desc", label: "Maior valor" },
  { value: "valor-asc", label: "Menor valor" },
];

interface ContractFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  clientOptions?: { value: string; label: string }[];
  responsibleOptions?: { value: string; label: string }[];
}

export function ContractFilters({
  query,
  onQueryChange,
  clientOptions = [],
  responsibleOptions = [],
}: ContractFiltersProps) {
  const { showInfo, showSuccess } = useFeedback();
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [responsibleFilter, setResponsibleFilter] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<string | null>(null);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  const handleFilterChange = (setter: (v: string | null) => void) => (value: string | null) => {
    setter(value);
    if (value) showInfo("Filtro aplicado.");
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Pesquisar contrato..."
            className="pl-9 h-9 text-xs bg-surface-inset border-border-subtle"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
          {clientOptions.length > 0 ? (
            <FilterDropdown
              label="Cliente"
              options={clientOptions}
              value={clientFilter}
              onChange={handleFilterChange(setClientFilter)}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => showInfo("Nenhum cliente disponível para filtrar.")}
              className="h-9 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40 hover:bg-surface-hover hover:text-foreground"
            >
              Cliente
            </Button>
          )}
          <FilterDropdown
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
          />
          {responsibleOptions.length > 0 ? (
            <FilterDropdown
              label="Responsável"
              options={responsibleOptions}
              value={responsibleFilter}
              onChange={handleFilterChange(setResponsibleFilter)}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => showInfo("Nenhum responsável disponível para filtrar.")}
              className="h-9 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40 hover:bg-surface-hover hover:text-foreground"
            >
              <User className="h-3.5 w-3.5" />
              Responsável
            </Button>
          )}
          <FilterDropdown
            label="Período"
            options={PERIODO_OPTIONS}
            value={periodFilter}
            onChange={handleFilterChange(setPeriodFilter)}
          />
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setMoreFiltersOpen(true)}
            className="h-9 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40 hover:bg-surface-hover hover:text-foreground"
          >
            <Filter className="h-3.5 w-3.5" />
            Mais filtros
          </Button>
          <FilterDropdown
            label="Ordenar"
            options={ORDENAR_OPTIONS}
            value={sortFilter}
            onChange={handleFilterChange(setSortFilter)}
          />
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => showSuccess("Exportação iniciada.")}
            className="h-9 gap-1.5 text-xs text-muted-foreground border-border-subtle bg-surface/40 hover:bg-surface-hover hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar
          </Button>
        </div>
      </div>

      <AppDrawer
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        title="Mais filtros"
        subtitle="Filtros avançados de contratos"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Filtros avançados como tipo de contrato, faixa de valor e tags estarão disponíveis em breve.
          </p>
          <Button
            size="sm"
            className="w-full bg-foreground text-accent-foreground hover:bg-foreground/90"
            onClick={() => {
              setMoreFiltersOpen(false);
              showInfo("Filtros avançados em breve.");
            }}
          >
            Entendi
          </Button>
        </div>
      </AppDrawer>
    </>
  );
}

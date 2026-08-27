"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ContractDrawer } from "@/components/contratos/ContractDrawer";
import { ContractFilters } from "@/components/contratos/ContractFilters";
import { ContractGrid } from "@/components/contratos/ContractGrid";
import { ContractHeader } from "@/components/contratos/ContractHeader";
import { ContractTabs } from "@/components/contratos/ContractTabs";
import { StatsCard } from "@/components/contratos/StatsCard";
import { Button } from "@/components/ui/button-shadcn";
import { useAppState } from "@/contexts/app-context";
import { getContractNewPath } from "@/lib/contract-routes";
import { getContratosList } from "@/lib/mock-data/contratos";
import type { Contract, ContractTab } from "@/lib/mock-data/contratos-types";
import { syncAllElectronicContractsInBackground } from "@/modules/electronic-contracts/sync-api";

function filterByTab(contracts: Contract[], tab: ContractTab): Contract[] {
  switch (tab) {
    case "rascunhos":
      return contracts.filter((c) => c.status === "rascunho");
    case "aguardando-assinatura":
      return contracts.filter((c) => c.status === "aguardando-assinatura");
    case "assinados":
      return contracts.filter((c) => c.status === "assinado");
    case "finalizados":
      return contracts.filter((c) => c.status === "finalizado");
    case "cancelados":
      return contracts.filter((c) => c.status === "cancelado");
    case "arquivados":
      return contracts.filter((c) => c.status === "arquivado" || c.status === "expirado");
    default:
      return contracts;
  }
}

function filterByQuery(contracts: Contract[], query: string): Contract[] {
  const q = query.trim().toLowerCase();
  if (!q) return contracts;

  return contracts.filter(
    (c) =>
      c.number.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.client.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.statusLabel.toLowerCase().includes(q)
  );
}

export function ContratosHome() {
  const { version } = useAppState();
  const [activeTab, setActiveTab] = useState<ContractTab>("todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Contract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const started = performance.now();
    try {
      if (sessionStorage.getItem("norax.contracts.synced") === "1") return;
      sessionStorage.setItem("norax.contracts.synced", "1");
    } catch {
      // ignore
    }
    syncAllElectronicContractsInBackground();
    console.info(
      `[perf] ContratosHome syncAll scheduled ${Math.round(performance.now() - started)}ms`
    );
  }, []);

  const data = useMemo(() => getContratosList(), [version]);

  const filteredContracts = useMemo(() => {
    const byTab = filterByTab(data.contracts, activeTab);
    return filterByQuery(byTab, query);
  }, [data.contracts, activeTab, query]);

  const handleSelect = (contract: Contract) => {
    setSelected(contract);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <ContractHeader />
        <Button asChild className="h-10 gap-2 bg-foreground text-accent-foreground shrink-0">
          <Link href={getContractNewPath()}>
            <Plus className="h-4 w-4" />
            Novo contrato
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {data.stats.map((stat, i) => (
          <StatsCard key={stat.id} {...stat} index={i} />
        ))}
      </div>

      <ContractTabs active={activeTab} onChange={setActiveTab} />

      <ContractFilters query={query} onQueryChange={setQuery} />

      <ContractGrid contracts={filteredContracts} onSelect={handleSelect} />

      <ContractDrawer contract={selected} open={drawerOpen} onClose={handleCloseDrawer} />
    </div>
  );
}

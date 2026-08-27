"use client";

import { startTransition, useMemo, useState } from "react";
import { financeiroData } from "@/lib/mock-data/financeiro";
import type { FinancialTab } from "@/lib/mock-data/financeiro-types";
import { FinancialHeader } from "@/components/financeiro/FinancialHeader";
import { FinancialSearch } from "@/components/financeiro/FinancialSearch";
import { StatsCard } from "@/components/financeiro/StatsCard";
import { FinancialFlow } from "@/components/financeiro/FinancialFlow";
import { FinancialTable } from "@/components/financeiro/FinancialTable";
import { CashSummary } from "@/components/financeiro/CashSummary";
import { UpcomingPayments } from "@/components/financeiro/UpcomingPayments";
import { RevenueDistribution } from "@/components/financeiro/RevenueDistribution";
import { RelatedContracts } from "@/components/financeiro/RelatedContracts";

const PAGE_SIZE = 8;

const TAB_CATEGORY_MAP: Record<FinancialTab, string[] | null> = {
  todas: null,
  receitas: ["receita"],
  despesas: ["despesa"],
  transferencias: ["transferencia"],
};

interface FinanceiroHomeProps {
  data?: typeof financeiroData;
}

function matchesGlobalQuery(
  movement: (typeof financeiroData.movements)[0],
  query: string
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    movement.descricao.toLowerCase().includes(q) ||
    movement.cliente.toLowerCase().includes(q) ||
    movement.projeto.toLowerCase().includes(q) ||
    movement.contratoNumero.toLowerCase().includes(q) ||
    movement.formaPagamento.toLowerCase().includes(q)
  );
}

function matchesTableQuery(
  movement: (typeof financeiroData.movements)[0],
  query: string
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    movement.descricao.toLowerCase().includes(q) ||
    movement.cliente.toLowerCase().includes(q) ||
    movement.contratoNumero.toLowerCase().includes(q)
  );
}

export function FinanceiroHome({ data = financeiroData }: FinanceiroHomeProps) {
  const [globalQuery, setGlobalQuery] = useState("");
  const [tableQuery, setTableQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FinancialTab>("todas");
  const [page, setPage] = useState(1);

  const filteredMovements = useMemo(() => {
    const allowed = TAB_CATEGORY_MAP[activeTab];
    return data.movements.filter((movement) => {
      if (allowed && !allowed.includes(movement.categoria)) return false;
      if (!matchesGlobalQuery(movement, globalQuery)) return false;
      if (!matchesTableQuery(movement, tableQuery)) return false;
      return true;
    });
  }, [activeTab, data.movements, globalQuery, tableQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / PAGE_SIZE));

  const paginatedMovements = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredMovements.slice(start, start + PAGE_SIZE);
  }, [filteredMovements, page, totalPages]);

  const handleTabChange = (tab: FinancialTab) => {
    startTransition(() => {
      setActiveTab(tab);
      setPage(1);
    });
  };

  return (
    <div className="space-y-5">
      <FinancialHeader />

      <FinancialSearch
        value={globalQuery}
        onChange={(value) => {
          setGlobalQuery(value);
          setPage(1);
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {data.stats.map((stat, i) => (
          <StatsCard key={stat.id} {...stat} index={i} />
        ))}
      </div>

      <FinancialFlow segments={data.flow} />

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full">
          <FinancialTable
            movements={paginatedMovements}
            totalCount={filteredMovements.length}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            searchQuery={tableQuery}
            onSearchChange={(value) => {
              setTableQuery(value);
              setPage(1);
            }}
            page={Math.min(page, totalPages)}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <aside className="w-full xl:w-[300px] shrink-0 space-y-4 xl:sticky xl:top-24 xl:self-start">
          <CashSummary items={data.cashSummary} />
          <UpcomingPayments payments={data.upcomingPayments} />
          <RevenueDistribution items={data.revenueDistribution} />
          <RelatedContracts contracts={data.relatedContracts} />
        </aside>
      </div>
    </div>
  );
}

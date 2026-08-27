"use client";

import type { ReportTab } from "@/lib/mock-data/relatorios-types";
import { TabUnderline } from "@/components/ui/tab-underline";
import { cn } from "@/lib/utils";

const TABS: { id: ReportTab; label: string }[] = [
  { id: "visao-geral", label: "Visão geral" },
  { id: "financeiro", label: "Financeiro" },
  { id: "projetos", label: "Projetos" },
  { id: "clientes", label: "Clientes" },
  { id: "contratos", label: "Contratos" },
  { id: "produtividade", label: "Produtividade" },
  { id: "equipe", label: "Equipe" },
  { id: "desempenho", label: "Desempenho" },
];

interface ReportsTabsProps {
  active: ReportTab;
  onChange: (tab: ReportTab) => void;
}

export function ReportsTabs({ active, onChange }: ReportsTabsProps) {
  return (
    <div className="flex items-center gap-5 sm:gap-6 border-b border-border-subtle overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative pb-3 text-xs font-medium whitespace-nowrap transition-colors capitalize",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {isActive && <TabUnderline />}
          </button>
        );
      })}
    </div>
  );
}

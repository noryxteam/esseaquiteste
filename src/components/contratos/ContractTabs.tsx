"use client";

import type { ContractTab } from "@/lib/mock-data/contratos-types";
import { TabUnderline } from "@/components/ui/tab-underline";
import { cn } from "@/lib/utils";

const TABS: { id: ContractTab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "rascunhos", label: "Rascunhos" },
  { id: "aguardando-assinatura", label: "Aguardando assinatura" },
  { id: "assinados", label: "Assinados" },
  { id: "finalizados", label: "Finalizados" },
  { id: "cancelados", label: "Cancelados" },
  { id: "arquivados", label: "Arquivados" },
];

interface ContractTabsProps {
  active: ContractTab;
  onChange: (tab: ContractTab) => void;
}

export function ContractTabs({ active, onChange }: ContractTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border-subtle">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && <TabUnderline />}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

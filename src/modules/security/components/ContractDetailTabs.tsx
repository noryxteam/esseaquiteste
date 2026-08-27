"use client";

import { useState } from "react";
import type { ElectronicContract } from "@/modules/electronic-contracts";
import { useAuth } from "@/contexts/auth-context";
import { hasPermission } from "@/modules/auth/utils/permissions";
import { ContractSummary } from "@/components/contracts/ContractSummary";
import { ContractActions } from "@/components/contracts/ContractBuilder";
import { ContractTimeline } from "@/components/contracts/ContractTimeline";
import { ContractPDF } from "@/components/contracts/ContractPDF";
import { ContractSignaturesPanel } from "@/modules/security/components/ContractSignaturesPanel";
import { ContractSecurityTab } from "@/modules/security/components/ContractSecurityTab";
import { TabUnderline } from "@/components/ui/tab-underline";
import { cn } from "@/lib/utils";

type DetailTab = "resumo" | "timeline" | "arquivos" | "assinaturas" | "seguranca";

const TABS: { id: DetailTab; label: string; requiresSecurity?: boolean }[] = [
  { id: "resumo", label: "Resumo" },
  { id: "timeline", label: "Linha do tempo" },
  { id: "arquivos", label: "Arquivos" },
  { id: "assinaturas", label: "Assinaturas" },
  { id: "seguranca", label: "Segurança", requiresSecurity: true },
];

interface ContractDetailTabsProps {
  contract: ElectronicContract;
  contractId: string;
  onAction: (action: string) => void | Promise<void>;
  loading?: boolean;
}

export function ContractDetailTabs({
  contract,
  contractId,
  onAction,
  loading,
}: ContractDetailTabsProps) {
  const { user } = useAuth();
  const canViewSecurity = hasPermission(user?.permissions, "security:view");
  const [activeTab, setActiveTab] = useState<DetailTab>("resumo");

  const visibleTabs = TABS.filter((t) => !t.requiresSecurity || canViewSecurity);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border-subtle">
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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

      {activeTab === "resumo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <ContractSummary contract={contract} />
            <ContractActions contract={contract} onAction={onAction} loading={loading} />
          </div>
        </div>
      )}

      {activeTab === "timeline" && <ContractTimeline events={contract.timeline} />}

      {activeTab === "arquivos" && <ContractPDF contract={contract} />}

      {activeTab === "assinaturas" && <ContractSignaturesPanel contract={contract} />}

      {activeTab === "seguranca" && canViewSecurity && (
        <ContractSecurityTab contractId={contractId} />
      )}
    </div>
  );
}

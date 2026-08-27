"use client";

import { useState } from "react";
import type { ElectronicContract } from "@/modules/electronic-contracts";
import { LIFECYCLE_LABELS } from "@/modules/electronic-contracts";
import { ContractTimeline } from "@/components/contracts/ContractTimeline";
import { ContractSummary } from "@/components/contracts/ContractSummary";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import {
  Archive,
  CheckCircle,
  FileCheck,
  Lock,
  Send,
  FileText,
} from "lucide-react";

interface ContractActionsProps {
  contract: ElectronicContract;
  onAction: (action: string) => void | Promise<void>;
  loading?: boolean;
}

const ACTION_MAP: Partial<
  Record<
    ElectronicContract["lifecycleStep"],
    { label: string; action: string; icon: React.ComponentType<{ className?: string }> }[]
  >
> = {
  criado: [{ label: "Salvar e continuar", action: "save", icon: FileText }],
  editado: [{ label: "Adicionar campos", action: "fields", icon: FileText }],
  campos_adicionados: [{ label: "Marcar como revisado", action: "review", icon: CheckCircle }],
  revisado: [{ label: "Tornar definitivo", action: "finalize", icon: Lock }],
  definitivo: [{ label: "Enviar ao cliente", action: "send", icon: Send }],
  cliente_assinou: [{ label: "Assinar como Norax", action: "sign-norax", icon: FileCheck }],
  norax_assinou: [{ label: "Gerar PDF definitivo", action: "pdf", icon: FileText }],
  pdf_gerado: [{ label: "Arquivar contrato", action: "archive", icon: Archive }],
};

export function ContractActions({ contract, onAction, loading }: ContractActionsProps) {
  const actions = ACTION_MAP[contract.lifecycleStep] ?? [];
  const [error, setError] = useState("");

  const handle = async (action: string) => {
    setError("");
    try {
      await onAction(action);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao executar ação");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-subtle bg-surface/40 p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Etapa atual</p>
        <p className="text-sm font-medium">{LIFECYCLE_LABELS[contract.lifecycleStep]}</p>
        {contract.isImmutable && (
          <p className="text-[10px] text-amber-400 mt-2 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Documento imutável — v{contract.versao}
          </p>
        )}
        {contract.accessCode && contract.status === "aguardando-assinatura" && (
          <p className="text-xs font-mono mt-2 text-foreground">
            Código: <span className="text-muted-foreground">{contract.accessCode}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {actions.map(({ label, action, icon: Icon }) => (
          <Button
            key={action}
            onClick={() => handle(action)}
            disabled={loading}
            className="w-full h-10 gap-2 bg-foreground text-accent-foreground hover:bg-foreground/90"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
        {error && <p className="text-xs text-state-red">{error}</p>}
      </div>
    </div>
  );
}

interface ContractBuilderProps {
  contract: ElectronicContract;
  onAction: (action: string) => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

export function ContractBuilder({ contract, onAction, loading, className }: ContractBuilderProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6", className)}>
      <div className="lg:col-span-4 space-y-4">
        <ContractSummary contract={contract} />
        <ContractActions contract={contract} onAction={onAction} loading={loading} />
      </div>
      <div className="lg:col-span-8">
        <div className="rounded-xl border border-border-subtle bg-surface/40 p-4">
          <p className="text-sm font-medium mb-4">Linha do tempo</p>
          <ContractTimeline events={contract.timeline} />
        </div>
      </div>
    </div>
  );
}

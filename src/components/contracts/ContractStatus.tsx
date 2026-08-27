"use client";

import type { ElectronicContractStatus } from "@/modules/electronic-contracts";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ElectronicContractStatus, string> = {
  rascunho: "bg-muted text-muted-foreground",
  "em-revisao": "bg-amber-500/15 text-amber-400",
  definitivo: "bg-blue-500/15 text-blue-400",
  "aguardando-assinatura": "bg-amber-500/15 text-amber-400",
  "parcialmente-assinado": "bg-purple-500/15 text-purple-400",
  assinado: "bg-emerald-500/15 text-emerald-400",
  finalizado: "bg-emerald-500/15 text-emerald-400",
  arquivado: "bg-muted text-muted-foreground",
  cancelado: "bg-red-500/15 text-red-400",
  expirado: "bg-red-500/15 text-red-400",
};

const STATUS_LABELS: Record<ElectronicContractStatus, string> = {
  rascunho: "Rascunho",
  "em-revisao": "Em revisão",
  definitivo: "Definitivo",
  "aguardando-assinatura": "Aguardando assinatura",
  "parcialmente-assinado": "Parcialmente assinado",
  assinado: "Assinado",
  finalizado: "Finalizado",
  arquivado: "Arquivado",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

interface ContractStatusProps {
  status: ElectronicContractStatus;
  className?: string;
}

export function ContractStatus({ status, className }: ContractStatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export { STATUS_LABELS as CONTRACT_STATUS_LABELS };

"use client";

import { CONTRACT_VARIABLES } from "@/modules/electronic-contracts";
import { cn } from "@/lib/utils";

interface ContractVariablesProps {
  onInsert?: (variable: string) => void;
  className?: string;
}

export function ContractVariables({ onInsert, className }: ContractVariablesProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Variáveis disponíveis
      </p>
      <div className="flex flex-wrap gap-1.5">
        {CONTRACT_VARIABLES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onInsert?.(v)}
            className="px-2 py-1 rounded-md border border-border-subtle bg-surface text-[11px] font-mono text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            {v}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">
        Substituídas automaticamente ao tornar o contrato definitivo.
      </p>
    </div>
  );
}

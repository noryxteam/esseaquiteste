"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RelatedContract } from "@/lib/mock-data/financeiro-types";
import { Button } from "@/components/ui/button-shadcn";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface RelatedContractsProps {
  contracts: RelatedContract[];
}

export function RelatedContracts({ contracts }: RelatedContractsProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-foreground">Contratos relacionados</h2>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <Link href={routes.contratos}>Ver todos</Link>
        </Button>
      </div>

      <div className="space-y-0">
        {contracts.map((contract) => (
          <button
            key={contract.id}
            type="button"
            onClick={() => router.push(routes.contrato(contract.contratoId))}
            className="flex items-center justify-between gap-2 py-2.5 border-b border-border-subtle last:border-0 w-full text-left hover:bg-surface-hover/40 -mx-1 px-1 rounded-md transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-mono text-foreground">{contract.numero}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{contract.cliente}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] font-medium text-foreground tabular-nums">{contract.valor}</p>
              <p className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                {contract.percentualRecebido}%
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-0.5 text-[9px] font-medium",
                contract.status === "recebido" && "bg-state-green/10 text-state-green",
                contract.status === "pendente" && "bg-state-orange/10 text-state-orange",
                contract.status === "parcial" && "bg-state-blue/10 text-state-blue"
              )}
            >
              {contract.statusLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

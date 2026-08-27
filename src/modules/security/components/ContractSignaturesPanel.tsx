"use client";

import type { ElectronicContract } from "@/modules/electronic-contracts";
import { ContractStatus } from "@/components/contracts/ContractStatus";

interface ContractSignaturesPanelProps {
  contract: ElectronicContract;
}

export function ContractSignaturesPanel({ contract }: ContractSignaturesPanelProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-subtle bg-surface/40 p-4">
        <h3 className="text-sm font-semibold mb-3">Assinaturas</h3>
        {contract.assinaturas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma assinatura registrada.</p>
        ) : (
          <ul className="space-y-3">
            {contract.assinaturas.map((sig, i) => (
              <li key={`${sig.role}-${i}`} className="flex items-start justify-between gap-4 text-xs border-b border-border-subtle pb-3 last:border-0">
                <div>
                  <p className="font-medium">{sig.nome}</p>
                  <p className="text-muted-foreground mt-0.5 capitalize">{sig.role}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">{sig.documento}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="tabular-nums text-muted-foreground">{sig.assinadoEm}</p>
                  {sig.aceiteEletronico && (
                    <p className="text-[10px] text-muted-foreground mt-1">Aceite eletrônico</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface/40 p-4">
        <p className="text-xs text-muted-foreground mb-2">Status do contrato</p>
        <ContractStatus status={contract.status} />
      </div>
    </div>
  );
}

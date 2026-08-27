"use client";

import type { ElectronicContract } from "@/modules/electronic-contracts";
import { ContractStatus } from "@/components/contracts/ContractStatus";

interface ContractSummaryProps {
  contract: ElectronicContract;
}

export function ContractSummary({ contract }: ContractSummaryProps) {
  const rows = [
    { label: "Número", value: contract.numeroContrato },
    { label: "Cliente", value: contract.variaveis.cliente },
    { label: "Empresa", value: contract.variaveis.empresa },
    { label: "Projeto", value: contract.variaveis.projeto },
    { label: "Valor", value: contract.variaveis.valor },
    { label: "Pagamento", value: contract.formaPagamento },
    { label: "Prazo", value: contract.prazo },
    { label: "Responsável", value: contract.responsavelNome },
    { label: "Versão", value: `v${contract.versao}` },
    { label: "Criação", value: contract.dataCriacao },
    { label: "Envio", value: contract.dataEnvio ?? "—" },
    { label: "Assinatura", value: contract.dataAssinatura ?? "—" },
  ];

  return (
    <div className="rounded-xl border border-border-subtle bg-surface/40 p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Resumo</h3>
        <ContractStatus status={contract.status} />
      </div>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 text-xs">
            <dt className="text-muted-foreground shrink-0">{row.label}</dt>
            <dd className="text-foreground text-right truncate">{row.value}</dd>
          </div>
        ))}
      </dl>
      {contract.shareLink && (
        <div className="pt-2 border-t border-border-subtle">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Link exclusivo</p>
          <p className="text-xs font-mono text-foreground break-all">{contract.shareLink}</p>
        </div>
      )}
    </div>
  );
}

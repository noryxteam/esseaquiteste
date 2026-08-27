import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import { ContractStatusBadge } from "@/components/contratos/ContractStatus";

interface ContractSummaryCardProps {
  data: ContractViewData;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border-subtle last:border-0">
      <span className="text-[11px] text-muted-foreground shrink-0">{label}</span>
      <span className="text-[11px] text-foreground text-right">{value}</span>
    </div>
  );
}

export function ContractSummaryCard({ data }: ContractSummaryCardProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <h2 className="text-xs font-medium text-foreground mb-3">Resumo</h2>

      <div className="mb-3">
        <ContractStatusBadge status={data.statusVariant} label={data.statusLabel} />
      </div>

      <div className="rounded-lg border border-border-subtle bg-surface/40 p-3">
        <Row
          label={data.isApagaLogo ? "Contratado" : "Empresa"}
          value={data.company.legalName || "—"}
        />
        <Row label="Cliente" value={data.client.name} />
        <Row label="Valor" value={data.value} />
        {data.isApagaLogo ? (
          <Row
            label="Pagamento"
            value={data.paymentMethod.replace(/\n/g, " · ") || "50% antes · 50% no final"}
          />
        ) : null}
        <Row label="Data" value={data.contractDate} />
        <Row label="Status" value={data.statusLabel} />
        <Row
          label="Assinaturas"
          value={`${data.signaturesCount} de ${data.signaturesTotal}`}
        />
        <Row label="Código" value={data.uniqueCode} />
      </div>
    </div>
  );
}

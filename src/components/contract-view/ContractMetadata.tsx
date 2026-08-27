import { CheckCircle2 } from "lucide-react";
import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import { Button } from "@/components/ui/button-shadcn";

interface ContractMetadataProps {
  data: ContractViewData;
}

function MetaRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border-subtle last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={`text-[11px] ${highlight ? "text-state-green" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export function ContractMetadata({ data }: ContractMetadataProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-5">
      <h2 className="text-sm font-medium text-foreground mb-4">Metadados do contrato</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <div>
          <MetaRow label="ID interno" value={data.metadata.internalId} />
          <MetaRow label="Versão" value={data.metadata.version} />
          <MetaRow label="Status atual" value={data.statusLabel} highlight />
        </div>
        <div>
          <MetaRow label="Visualizações" value={String(data.metadata.views)} />
          <MetaRow label="Dispositivos autorizados" value={String(data.metadata.authorizedDevices)} />
          <MetaRow label="Último acesso" value={data.metadata.lastAccess} />
          <MetaRow label="IP" value={data.metadata.ip} />
        </div>
      </div>
    </div>
  );
}

interface ContractSecurityCardProps {
  data: ContractViewData;
}

const SECURITY_ITEMS = [
  "Documento original",
  "Integridade verificada",
  "Assinatura eletrônica",
  "Auditoria registrada",
  "Criptografia ativa",
];

export function ContractSecurityCard({ data }: ContractSecurityCardProps) {
  if (!data.protected) return null;

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <h2 className="text-xs font-medium text-foreground mb-3">Documento protegido</h2>
      <ul className="space-y-2">
        {SECURITY_ITEMS.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-state-green shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 w-full h-8 text-[10px] text-muted-foreground hover:text-foreground justify-between px-0 hover:bg-transparent"
      >
        Ver informações técnicas
        <span>→</span>
      </Button>
    </div>
  );
}

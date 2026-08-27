"use client";

import { CheckCircle2, Download, ShieldCheck } from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractStatus } from "@/components/contract-view/ContractStatus";
import { ViewerSignaturesCard } from "@/components/contract-view/ViewerSignaturesCard";
import { getSignedAtLabel } from "@/components/contract-view/viewer-utils";
import { Button } from "@/components/ui/button-shadcn";

interface ViewerInfoPanelProps {
  data: ContractDocumentData;
  isAdmin: boolean;
  onDownload: () => void;
  onRequestSign: (role: "norax" | "cliente") => void;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[11px] text-white/40 shrink-0">{label}</span>
      <div className="text-[11px] text-white/80 text-right min-w-0">{children}</div>
    </div>
  );
}

export function ViewerInfoPanel({
  data,
  isAdmin,
  onDownload,
  onRequestSign,
}: ViewerInfoPanelProps) {
  const signedAt = getSignedAtLabel(data);
  const isValid =
    data.statusVariant === "assinado" || data.statusVariant === "finalizado";

  return (
    <aside className="w-[320px] shrink-0 border-l border-white/[0.06] bg-[#0a0a0a] overflow-y-auto sticky top-0 h-[calc(100vh-64px)] self-start">
      <div className="space-y-4 p-4">
        <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h2 className="text-xs font-medium text-white mb-3">Informações do contrato</h2>
          <InfoRow label="Status">
            <ContractStatus status={data.statusVariant} label={data.statusLabel} />
          </InfoRow>
          <InfoRow label="Cliente">{data.client.name || data.client.company || "—"}</InfoRow>
          <InfoRow label="Empresa">{data.company.legalName || data.company.name}</InfoRow>
          <InfoRow label="Valor">{data.value}</InfoRow>
          <InfoRow label="Assinado em">{signedAt}</InfoRow>
          <InfoRow label="Validade jurídica">
            <span className="inline-flex items-center gap-1 text-emerald-400/90">
              <CheckCircle2 className="h-3 w-3" />
              {isValid ? "Documento válido" : "Pendente de assinatura"}
            </span>
          </InfoRow>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full mt-4 h-8 gap-1.5 border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.06] text-xs"
            onClick={onDownload}
          >
            <Download className="h-3.5 w-3.5" />
            Baixar PDF
          </Button>
        </section>

        <ViewerSignaturesCard
          data={data}
          isAdmin={isAdmin}
          onRequestSign={onRequestSign}
        />

        <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" />
            <h2 className="text-xs font-medium text-emerald-400/90">Autenticação</h2>
          </div>
          <p className="text-[11px] text-white/45 mb-3">Documento autenticado digitalmente</p>
          <p className="text-[10px] text-white/35 mb-1">Hash (SHA-256)</p>
          <p className="font-mono text-[10px] text-white/70 break-all rounded-lg border border-white/[0.06] bg-black/40 px-2.5 py-2 leading-relaxed">
            {data.hash}
          </p>
          <div className="mt-3 space-y-0">
            <InfoRow label="Última alteração">{data.history[0]?.date ?? "Nunca"}</InfoRow>
            <InfoRow label="Integridade">
              <span className="inline-flex items-center gap-1 text-emerald-400/90">
                <CheckCircle2 className="h-3 w-3" />
                Verificado e íntegro
              </span>
            </InfoRow>
          </div>
        </section>
      </div>
    </aside>
  );
}

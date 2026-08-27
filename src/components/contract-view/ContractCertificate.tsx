import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { CheckCircle2 } from "lucide-react";

interface ContractCertificateProps {
  data: ContractDocumentData;
  textScale?: number;
  /** Compacto quando fica na mesma página das assinaturas */
  embedded?: boolean;
}

export function ContractCertificate({
  data,
  textScale = 100,
  embedded,
}: ContractCertificateProps) {
  const fontSize = ((embedded ? 10 : 11) * textScale) / 100;
  const isValid =
    data.statusVariant === "assinado" || data.statusVariant === "finalizado";

  return (
    <div
      className={embedded ? "mt-6 pt-6 border-t border-[#e4e4e7] space-y-4" : "space-y-6"}
      style={{ fontSize: `${fontSize}px` }}
    >
      {!embedded && (
        <div className="text-center border-b border-[#e4e4e7] pb-6">
          <h2 className="text-base font-bold tracking-wide text-[#18181b] uppercase">
            Certificado de Autenticidade
          </h2>
          <p className="text-[#71717a] mt-2 text-xs">
            Este certificado comprova a autenticidade e integridade do documento eletrônico
          </p>
        </div>
      )}

      {embedded && (
        <h3 className="text-[11px] font-semibold tracking-wide text-[#18181b] uppercase">
          Autenticidade do documento
        </h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-[#3f3f46]">
        <div className="flex justify-between gap-2 border-b border-[#f4f4f5] pb-2">
          <span className="text-[#a1a1aa]">Número do contrato</span>
          <span className="font-mono font-medium text-[#18181b]">{data.number}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-[#f4f4f5] pb-2">
          <span className="text-[#a1a1aa]">Empresa</span>
          <span className="text-[#18181b] text-right">{data.company.legalName}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-[#f4f4f5] pb-2">
          <span className="text-[#a1a1aa]">Cliente</span>
          <span className="text-[#18181b] text-right">{data.client.name || data.client.company}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-[#f4f4f5] pb-2">
          <span className="text-[#a1a1aa]">Data de emissão</span>
          <span>{data.issuedAt}</span>
        </div>
        {!data.isApagaLogo && (
          <>
            <div className="flex justify-between gap-2 border-b border-[#f4f4f5] pb-2">
              <span className="text-[#a1a1aa]">Código único</span>
              <span className="font-mono">{data.uniqueCode}</span>
            </div>
            <div className="flex justify-between gap-2 border-b border-[#f4f4f5] pb-2">
              <span className="text-[#a1a1aa]">Hash SHA-256</span>
              <span className="font-mono">{data.hashShort}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa] px-4 py-3.5">
        <span
          className={
            isValid
              ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-700"
              : "inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-700"
          }
        >
          <span
            className={
              isValid ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-amber-500"
            }
          />
          {isValid ? "Documento válido" : "Aguardando assinaturas"}
        </span>
        <p className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium shrink-0">
          <CheckCircle2 className="h-4 w-4" />
          Integridade verificada
        </p>
      </div>
    </div>
  );
}

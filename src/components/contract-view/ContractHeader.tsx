import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";

interface ContractHeaderProps {
  data: ContractDocumentData;
  compact?: boolean;
}

/**
 * Cabeçalho do PDF: logo Norax + título central.
 * Sem código NX e sem status "Rascunho" no documento.
 */
export function ContractHeader({ compact }: ContractHeaderProps) {
  return (
    <header
      className={`relative border-b border-[#e4e4e7] ${compact ? "pb-4 mb-4" : "pb-8 mb-8"}`}
    >
      <div className={`flex items-start justify-between gap-4 ${compact ? "" : "min-h-[56px]"}`}>
        <div className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/norax-mark.svg"
            alt="Norax"
            className={compact ? "h-9 w-auto object-contain" : "h-12 w-auto object-contain"}
            draggable={false}
          />
        </div>

        <div className="flex-1 text-center px-2 self-center">
          <p
            className={`font-bold uppercase tracking-[0.18em] text-[#18181b] ${
              compact ? "text-[8px]" : "text-[11px]"
            }`}
          >
            Contrato de Prestação de Serviços
          </p>
          {!compact && (
            <p className="mt-2 text-[10px] text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Documento eletrônico com validade jurídica
            </p>
          )}
        </div>

        {/* Espaço simétrico à logo — sem código NX / sem Rascunho */}
        <div className={compact ? "w-9 shrink-0" : "w-12 shrink-0"} aria-hidden />
      </div>
    </header>
  );
}

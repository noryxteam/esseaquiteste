import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractProtection } from "@/components/contract-view/ContractProtection";

interface ContractFooterProps {
  data: ContractDocumentData;
  page: number;
  total: number;
  compact?: boolean;
}

export function ContractFooter({ data, page, total, compact }: ContractFooterProps) {
  return (
    <footer
      className={`mt-auto pt-4 border-t border-[#e4e4e7] flex items-end justify-between gap-3 ${compact ? "pt-2" : ""}`}
    >
      <ContractProtection />
      {data.isApagaLogo ? (
        <div className="flex-1 min-w-0" />
      ) : (
        <div className="text-center flex-1 min-w-0 px-2">
          <p className={`text-[#a1a1aa] ${compact ? "text-[6px]" : "text-[7px]"}`}>
            Código único do documento
          </p>
          <p
            className={`font-mono text-[#52525b] truncate ${compact ? "text-[6px]" : "text-[7px]"}`}
          >
            {data.hashShort}
          </p>
        </div>
      )}
      <div className="text-right shrink-0">
        <p className={`text-[#a1a1aa] ${compact ? "text-[6px]" : "text-[7px]"}`}>
          Página {page} de {total}
        </p>
      </div>
    </footer>
  );
}

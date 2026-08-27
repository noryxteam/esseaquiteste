import { Shield } from "lucide-react";
import type { ContractViewData } from "@/lib/mock-data/contract-view-types";

interface ContractValidationProps {
  data: ContractViewData;
}

export function ContractValidation({ data }: ContractValidationProps) {
  return (
    <section className="mt-10 pt-8 border-t border-[#e4e4e7]">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-[#71717a]" />
        <h2 className="text-[11px] font-bold tracking-[0.12em] text-[#18181b] uppercase">
          Validação do Documento
        </h2>
      </div>

      <div className="rounded-md border border-[#e4e4e7] bg-[#fafafa] p-4 space-y-2.5 text-[10px]">
        <div className="flex justify-between gap-4">
          <span className="text-[#a1a1aa]">Código único do contrato</span>
          <span className="font-mono font-medium text-[#18181b]">{data.uniqueCode}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#a1a1aa]">Hash criptográfico (SHA-256)</span>
          <span className="font-mono font-medium text-[#18181b]">{data.hashShort}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#a1a1aa]">Data da emissão</span>
          <span className="text-[#3f3f46]">{data.issuedAt}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#a1a1aa]">Última validação</span>
          <span className="text-[#3f3f46]">{data.lastValidation}</span>
        </div>
        <div className="flex justify-between gap-4 pt-2 border-t border-[#e4e4e7]">
          <span className="text-[#a1a1aa]">Documento protegido</span>
          <span className="text-emerald-700 font-medium">
            {data.protected ? "Sim" : "Não"}
          </span>
        </div>
      </div>
    </section>
  );
}

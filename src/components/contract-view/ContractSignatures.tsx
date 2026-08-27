"use client";

import { CheckCircle2, PenLine } from "lucide-react";
import type { ContractSignature } from "@/lib/mock-data/contract-view-types";
import { Button } from "@/components/ui/button-shadcn";

interface ContractSignaturesProps {
  signatures: ContractSignature[];
}

export function ContractSignatures({ signatures }: ContractSignaturesProps) {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {signatures.map((sig) => (
        <div
          key={sig.role}
          className="rounded-md border border-[#e4e4e7] bg-[#fafafa] p-4"
        >
          <p className="text-[10px] font-bold tracking-wider text-[#71717a] uppercase mb-3">
            {sig.roleLabel}
          </p>

          <div className="space-y-1.5 text-[10px] text-[#3f3f46]">
            <p>
              <span className="text-[#a1a1aa]">Nome:</span> {sig.name}
            </p>
            <p>
              <span className="text-[#a1a1aa]">CPF/CNPJ:</span> {sig.document}
            </p>
            {sig.date && (
              <p>
                <span className="text-[#a1a1aa]">Data:</span> {sig.date}
                {sig.time && ` às ${sig.time}`}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#e4e4e7]">
            {sig.status === "assinado" ? (
              <div className="space-y-1">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Assinado eletronicamente
                </p>
                {sig.code && (
                  <p className="text-[9px] font-mono text-[#71717a]">Código: {sig.code}</p>
                )}
              </div>
            ) : (
              <Button
                size="sm"
                className="h-8 text-[10px] bg-[#18181b] text-white hover:bg-[#18181b]/90"
              >
                <PenLine className="h-3 w-3 mr-1.5" />
                Assinar contrato
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

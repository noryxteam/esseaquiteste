"use client";

import type { ElectronicContract } from "@/modules/electronic-contracts";
import { Button } from "@/components/ui/button-shadcn";
import { Download, FileText, Lock } from "lucide-react";

interface ContractPDFProps {
  contract: ElectronicContract;
}

export function ContractPDF({ contract }: ContractPDFProps) {
  if (!contract.pdfUrl) {
    return (
      <div className="rounded-xl border border-dashed border-border-subtle p-8 text-center">
        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">PDF definitivo ainda não gerado</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface/40 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-semibold">PDF definitivo</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Documento bloqueado para edição. Hash:{" "}
        <span className="font-mono text-foreground">{contract.hashDocumento}</span>
      </p>
      <p className="text-xs text-muted-foreground font-mono">{contract.pdfUrl}</p>
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => alert("Download simulado — integração PDF na próxima etapa")}
      >
        <Download className="h-4 w-4" />
        Baixar PDF definitivo
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Download, History, ShieldOff, Users } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { useFeedback } from "@/contexts/feedback-context";
import { WhoHasAccessModal } from "@/components/contract-view/WhoHasAccessModal";

interface ContractActionsCardProps {
  contractId: string;
}

export function ContractActionsCard({ contractId }: ContractActionsCardProps) {
  const { showInfo, showSuccess } = useFeedback();
  const [accessOpen, setAccessOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 space-y-2">
      <h2 className="text-xs font-medium text-foreground mb-3">Ações rápidas</h2>

      <Button
        variant="outline"
        type="button"
        className="w-full h-9 gap-2 text-xs border-border-subtle text-muted-foreground hover:text-foreground"
        onClick={() => setAccessOpen(true)}
      >
        <Users className="h-3.5 w-3.5" />
        Ver quem tem acesso
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full h-9 gap-2 text-xs border-border-subtle text-muted-foreground hover:text-foreground"
        onClick={() => showInfo("Dispositivo revogado.")}
      >
        <ShieldOff className="h-3.5 w-3.5" />
        Revogar dispositivo
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full h-9 gap-2 text-xs border-border-subtle text-muted-foreground hover:text-foreground"
        onClick={() => showInfo("Histórico completo do contrato.")}
      >
        <History className="h-3.5 w-3.5" />
        Histórico completo
      </Button>
      <Button
        variant="outline"
        type="button"
        className="w-full h-9 gap-2 text-xs border-border-subtle text-muted-foreground hover:text-foreground"
        onClick={() => showSuccess("Download do PDF iniciado.")}
      >
        <Download className="h-3.5 w-3.5" />
        Baixar PDF
      </Button>

      <WhoHasAccessModal
        open={accessOpen}
        contractId={contractId}
        onClose={() => setAccessOpen(false)}
      />
    </div>
  );
}

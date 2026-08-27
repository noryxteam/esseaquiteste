"use client";

import { useMemo, useState } from "react";
import { Download, Printer, Send } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { downloadContractPdf, printContractDocument } from "@/lib/contract-print";
import {
  CONTRACT_EMAIL_MSG,
  CONTRACT_WA_MSG,
  deliverContractInvite,
  getContractSendDefaults,
} from "@/modules/electronic-contracts/send-to-client";
import { electronicContractService } from "@/modules/electronic-contracts";
import { SendFormModal } from "@/modules/client-forms/components/SendFormModal";
import { useFeedback } from "@/contexts/feedback-context";
import { useAppStateOptional } from "@/contexts/app-context";

interface ContractViewerToolbarProps {
  contractId: string;
}

export function ContractViewerToolbar({ contractId }: ContractViewerToolbarProps) {
  const { showSuccess, showInfo } = useFeedback();
  const app = useAppStateOptional();
  const [sendOpen, setSendOpen] = useState(false);

  const defaults = useMemo(() => getContractSendDefaults(contractId), [contractId, sendOpen]);

  const openSend = () => {
    const existing = getContractSendDefaults(contractId).contract;
    if (!existing) {
      showInfo("Contrato não encontrado.");
      return;
    }
    try {
      if (!existing.isImmutable) {
        electronicContractService.prepareForClientSend(existing.id);
        app?.invalidate();
      }
      setSendOpen(true);
    } catch (e) {
      showInfo(e instanceof Error ? e.message : "Não foi possível preparar o contrato.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs border-border-subtle text-muted-foreground hover:text-foreground bg-surface/40"
          onClick={openSend}
        >
          <Send className="h-3.5 w-3.5" />
          Enviar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs border-border-subtle text-muted-foreground hover:text-foreground bg-surface/40"
          onClick={() => downloadContractPdf()}
        >
          <Download className="h-3.5 w-3.5" />
          Baixar PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs border-border-subtle text-muted-foreground hover:text-foreground bg-surface/40"
          onClick={() => printContractDocument()}
        >
          <Printer className="h-3.5 w-3.5" />
          Imprimir
        </Button>
      </div>

      <SendFormModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        formUrl={defaults.publicUrl}
        formTitle={defaults.title}
        defaultPhone={defaults.phone}
        defaultEmail={defaults.email}
        title="Enviar contrato"
        description="Escolha como deseja enviar o contrato para o cliente."
        linkLabel="Link do contrato"
        linkHelp="Compartilhe este link com o cliente para visualizar e assinar."
        submitLabel="Enviar contrato"
        subjectPrefix="Contrato"
        defaultWaMessage={CONTRACT_WA_MSG}
        defaultEmailMessage={CONTRACT_EMAIL_MSG}
        onConfirm={async (payload) => {
          try {
            await deliverContractInvite({ contractId, ...payload });
            app?.invalidate();
            setSendOpen(false);
            showSuccess(
              payload.channel === "whatsapp"
                ? "WhatsApp aberto com o contrato."
                : "E-mail do contrato enviado ao cliente."
            );
          } catch (e) {
            showInfo(e instanceof Error ? e.message : "Falha ao enviar o contrato.");
          }
        }}
      />
    </>
  );
}

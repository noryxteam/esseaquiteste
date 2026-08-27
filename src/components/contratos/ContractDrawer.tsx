"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Copy,
  Eye,
  History,
  Link2,
  Send,
  X,
} from "lucide-react";
import type { Contract } from "@/lib/mock-data/contratos-types";
import { ContractStatusBadge } from "@/components/contratos/ContractStatus";
import { ContractPreview } from "@/components/contratos/ContractPreview";
import { OpeningContractOverlay } from "@/components/contract-view/OpeningContractOverlay";
import { Button } from "@/components/ui/button-shadcn";
import { useFeedback } from "@/contexts/feedback-context";
import { useAppStateOptional } from "@/contexts/app-context";
import { routes } from "@/lib/app-routes";
import { getContractAdminPath } from "@/lib/contract-routes";
import {
  CONTRACT_EMAIL_MSG,
  CONTRACT_WA_MSG,
  deliverContractInvite,
  getContractSendDefaults,
} from "@/modules/electronic-contracts/send-to-client";
import { shareContractLink } from "@/lib/contract-print";
import { electronicContractService } from "@/modules/electronic-contracts";
import { SendFormModal } from "@/modules/client-forms/components/SendFormModal";

interface ContractDrawerProps {
  contract: Contract | null;
  open: boolean;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border-subtle last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs text-foreground text-right">{value}</span>
    </div>
  );
}

export function ContractDrawer({ contract, open, onClose }: ContractDrawerProps) {
  const router = useRouter();
  const { showInfo, showSuccess } = useFeedback();
  const app = useAppStateOptional();
  const [opening, setOpening] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const handleViewContract = () => {
    if (!contract || opening) return;
    setOpening(true);
    router.push(getContractAdminPath(contract.id));
  };

  const openSendModal = () => {
    if (!contract) return;
    const defaults = getContractSendDefaults(contract.id);
    if (!defaults.contract) {
      showInfo("Contrato não encontrado.");
      return;
    }
    try {
      if (!defaults.contract.isImmutable) {
        electronicContractService.prepareForClientSend(defaults.contract.id);
        app?.invalidate();
      }
      setSendOpen(true);
    } catch (e) {
      showInfo(e instanceof Error ? e.message : "Não foi possível preparar o contrato.");
    }
  };

  const handleCopyLink = async () => {
    if (!contract) return;
    const electronic = electronicContractService.getById(contract.id);
    const link =
      getContractSendDefaults(contract.id).publicUrl || electronic?.shareLink;
    if (!link) {
      showInfo("Envie o contrato primeiro para gerar o link do cliente.");
      return;
    }
    const ok = await shareContractLink(link);
    if (ok) showSuccess("Link copiado.");
    else showInfo(link);
  };

  const sendDefaults = contract
    ? getContractSendDefaults(contract.id)
    : { title: "", phone: "", email: "", publicUrl: "", contract: null };

  return (
    <>
      <AnimatePresence>
        {open && contract && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={opening ? undefined : onClose}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-[400px] border-l border-border-subtle bg-background flex flex-col"
              role="dialog"
              aria-modal
              aria-label="Detalhes do contrato"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle shrink-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{contract.title}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{contract.number}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={onClose}
                  disabled={opening}
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                <div className="w-32 mx-auto">
                  <ContractPreview
                    title={contract.title}
                    client={contract.client}
                    number={contract.number}
                  />
                </div>

                <ContractStatusBadge status={contract.status} label={contract.statusLabel} />

                <div className="rounded-lg border border-border-subtle bg-surface/40 p-3">
                  <DetailRow label="Cliente" value={contract.client} />
                  <DetailRow label="Telefone" value={contract.phone} />
                  <DetailRow label="E-mail" value={contract.email} />
                  <DetailRow label="Valor" value={contract.valueFormatted} />
                  <DetailRow label="Criação" value={contract.createdAt} />
                  <DetailRow label="Envio" value={contract.sentAt ?? "—"} />
                  <DetailRow label="Quem criou" value={contract.createdBy.name} />
                  <DetailRow label="Última alteração" value={contract.updatedAt} />
                  <DetailRow
                    label="Assinaturas"
                    value={`${contract.signaturesCount} de ${contract.signaturesTotal}`}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    className="w-full h-9 gap-2 bg-foreground text-accent-foreground hover:bg-foreground/90"
                    onClick={handleViewContract}
                    disabled={opening}
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar contrato
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-9 gap-2 border-border-subtle text-muted-foreground hover:text-foreground"
                    onClick={openSendModal}
                  >
                    <Send className="h-4 w-4" />
                    Enviar contrato
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-9 gap-2 border-border-subtle text-muted-foreground hover:text-foreground"
                    onClick={() => void handleCopyLink()}
                  >
                    <Link2 className="h-4 w-4" />
                    Copiar link
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      type="button"
                      className="h-9 gap-1.5 text-xs border-border-subtle text-muted-foreground hover:text-foreground"
                      onClick={() => router.push(routes.contrato(contract.id))}
                    >
                      <History className="h-3.5 w-3.5" />
                      Histórico
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      className="h-9 gap-1.5 text-xs border-border-subtle text-muted-foreground hover:text-foreground"
                      onClick={() => showSuccess("Contrato duplicado.")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Duplicar
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    type="button"
                    className="w-full h-9 gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      showInfo("Contrato arquivado.");
                      onClose();
                    }}
                  >
                    <Archive className="h-4 w-4" />
                    Arquivar
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <OpeningContractOverlay open={opening} />

      {contract ? (
        <SendFormModal
          open={sendOpen}
          onClose={() => setSendOpen(false)}
          formUrl={sendDefaults.publicUrl}
          formTitle={sendDefaults.title}
          defaultPhone={sendDefaults.phone}
          defaultEmail={sendDefaults.email}
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
              await deliverContractInvite({ contractId: contract.id, ...payload });
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
      ) : null}
    </>
  );
}

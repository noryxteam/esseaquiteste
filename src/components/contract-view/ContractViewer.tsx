"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractPage } from "@/components/contract-view/ContractPage";
import { ContractPrintArea } from "@/components/contract-view/ContractPrintArea";
import { ViewerTopBar } from "@/components/contract-view/ViewerTopBar";
import { ViewerPagesPanel } from "@/components/contract-view/ViewerPagesPanel";
import { ViewerInfoPanel } from "@/components/contract-view/ViewerInfoPanel";
import {
  SignatureFlowModal,
  type SignRole,
} from "@/components/contract-view/SignatureFlowModal";
import { Button } from "@/components/ui/button-shadcn";
import { useFeedback } from "@/contexts/feedback-context";
import {
  downloadContractPdf,
  printContractDocument,
  shareContractLink,
} from "@/lib/contract-print";
import { getContractAdminPath } from "@/lib/contract-routes";
import { electronicContractService } from "@/modules/electronic-contracts";
import { toContractDocumentData } from "@/modules/electronic-contracts/adapter";
import { syncElectronicContractInBackground, ensureContractSyncedInBackend } from "@/modules/electronic-contracts/sync-api";
import {
  CONTRACT_EMAIL_MSG,
  CONTRACT_WA_MSG,
  deliverContractInvite,
  getContractSendDefaults,
} from "@/modules/electronic-contracts/send-to-client";
import { SendFormModal } from "@/modules/client-forms/components/SendFormModal";
import { portalApi } from "@/modules/security/api/security.api";
import { getDeviceFingerprint, getPortalToken } from "@/modules/security/services/device-fingerprint";
import { canSignWithPermission, type DevicePermission } from "@/modules/security/types";
import { hasAdminPanelSession } from "@/modules/security/services/portal-access";
import { useAppStateOptional } from "@/contexts/app-context";

interface ContractViewerProps {
  data: ContractDocumentData;
  /** Chamado quando o documento é atualizado (assinatura, etc.) — preparado para WebSocket */
  onDocumentChange?: (data: ContractDocumentData) => void;
}

type ModalKind = null | "history";

const ease = [0.22, 1, 0.36, 1] as const;
const PAGE_CSS_W = 794;
const PAGE_CSS_H = 1123;

export function ContractViewer({ data: initialData, onDocumentChange }: ContractViewerProps) {
  const { showInfo, showSuccess } = useFeedback();
  const app = useAppStateOptional();
  const [doc, setDoc] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(110);
  const [pagesOpen, setPagesOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canSign, setCanSign] = useState(true);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [signRole, setSignRole] = useState<SignRole | null>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollingTo = useRef<number | null>(null);

  useEffect(() => {
    setDoc(initialData);
  }, [initialData]);

  useEffect(() => {
    setIsAdmin(hasAdminPanelSession());
  }, []);

  useEffect(() => {
    const apply = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setPagesOpen(false);
        const available = Math.max(280, window.innerWidth - 24);
        setZoom(Math.max(38, Math.min(100, Math.round((available / PAGE_CSS_W) * 100))));
      } else {
        setZoom((z) => (z < 80 ? 110 : z));
      }
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (doc.isApagaLogo) {
        if (!cancelled) setCanSign(true);
        return;
      }
      try {
        if (hasAdminPanelSession()) {
          if (!cancelled) setCanSign(true);
          return;
        }
        const fp = getDeviceFingerprint();
        const slug = doc.uniqueSlug || doc.id;
        const res = await portalApi.getAccessStatus(slug, fp);
        if (cancelled) return;
        const permission = res.data.permission as DevicePermission | undefined;
        setCanSign(Boolean(res.data.canSign ?? canSignWithPermission(permission)));
      } catch {
        if (!cancelled) setCanSign(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doc.id, doc.uniqueSlug, doc.isApagaLogo]);

  const goToPage = useCallback((page: number) => {
    const next = Math.min(doc.totalPages, Math.max(1, page));
    setCurrentPage(next);
    scrollingTo.current = next;
    const el = pageRefs.current.get(next);
    const root = scrollRef.current;
    if (el && root) {
      const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 8;
      root.scrollTo({ top, behavior: "smooth" });
    }
    if (window.innerWidth < 1024) setPagesOpen(false);
    window.setTimeout(() => {
      scrollingTo.current = null;
    }, 450);
  }, [doc.totalPages]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(180, z + 10)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(70, z - 10)), []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    root.addEventListener("wheel", onWheel, { passive: false });

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingTo.current != null) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (!top) return;
        const id = Number((top.target as HTMLElement).dataset.pageId);
        if (id) setCurrentPage(id);
      },
      { root, threshold: [0.35, 0.55, 0.75] }
    );

    pageRefs.current.forEach((el) => observer.observe(el));
    return () => {
      root.removeEventListener("wheel", onWheel);
      observer.disconnect();
    };
  }, [doc.pages, zoomIn, zoomOut]);

  const handleShare = async () => {
    if (isAdmin) {
      try {
        const defaults = getContractSendDefaults(doc.id);
        if (!defaults.contract) {
          showInfo("Contrato não encontrado.");
          return;
        }
        if (!defaults.contract.isImmutable) {
          electronicContractService.prepareForClientSend(defaults.contract.id);
          app?.invalidate();
        }
        setSendOpen(true);
      } catch (e) {
        showInfo(e instanceof Error ? e.message : "Não foi possível preparar o contrato.");
      }
      return;
    }

    const ok = await shareContractLink(doc.shareLink);
    if (ok) {
      setShareFeedback(true);
      window.setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  const handleClose = () => {
    if (isAdmin) {
      window.location.href = getContractAdminPath(doc.id);
      return;
    }
    window.history.back();
  };

  const handleRequestSign = (role: SignRole) => {
    if (role === "norax" && !isAdmin) {
      showInfo("Este campo é reservado para a assinatura da Norax.");
      return;
    }
    if (role === "cliente" && isAdmin && !doc.isApagaLogo) {
      showInfo("Este campo é reservado para a assinatura do cliente.");
      return;
    }
    if (role === "cliente" && !isAdmin && !canSign) {
      showInfo("Este dispositivo só pode visualizar o contrato. Peça permissão de Assinante.");
      return;
    }
    const existing = doc.signatures.find(
      (s) => (role === "norax" ? s.role === "empresa" : s.role === "cliente")
    );
    if (existing?.status === "assinado") {
      showInfo("Esta parte já assinou o contrato.");
      return;
    }
    setSignRole(role);
  };

  const handleSignComplete = async (result: {
    nome: string;
    documento: string;
    data: string;
    hora: string;
    aceiteEletronico: true;
  }) => {
    if (!signRole) return;

    // Cliente no portal: só API do backend (não existe contrato no localStorage do cliente)
    if (signRole === "cliente" && !isAdmin) {
      const fp = getDeviceFingerprint();
      const slug = doc.uniqueSlug || doc.id;
      await portalApi.sign(slug, {
        fingerprint: fp,
        portalToken: getPortalToken(slug) ?? undefined,
        nome: result.nome,
        documento: result.documento,
        data: result.data,
        hora: result.hora,
        aceiteEletronico: true,
      });

      const next: ContractDocumentData = {
        ...doc,
        signatures: doc.signatures.map((s) =>
          s.role === "cliente"
            ? {
                ...s,
                name: result.nome,
                document: result.documento,
                date: result.data,
                time: result.hora,
                status: "assinado" as const,
              }
            : s
        ),
        signaturesCount: doc.signatures.filter((s) => s.status === "assinado").length +
          (doc.signatures.some((s) => s.role === "cliente" && s.status === "assinado") ? 0 : 1),
      };
      const signedCount = next.signatures.filter((s) => s.status === "assinado").length;
      next.signaturesCount = signedCount;
      if (signedCount >= 2) {
        next.statusVariant = "assinado";
        next.statusLabel = "Assinado";
      }

      setDoc(next);
      onDocumentChange?.(next);
      showSuccess("Assinatura registrada com sucesso.");
      setSignRole(null);
      return;
    }

    const updated =
      signRole === "norax"
        ? electronicContractService.signAsNorax(doc.id, {
            nome: result.nome,
            documento: result.documento,
            data: result.data,
            hora: result.hora,
          })
        : electronicContractService.signAsClient(doc.id, result);

    const next = toContractDocumentData(updated);
    setDoc(next);
    onDocumentChange?.(next);

    // Norax: espera sync para o portal do cliente ver a assinatura
    try {
      await Promise.race([
        ensureContractSyncedInBackend(updated),
        new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 2500)),
      ]);
    } catch (err) {
      console.error("[norax] Sync pós-assinatura falhou:", err);
      syncElectronicContractInBackground(updated);
    }

    showSuccess("Assinatura registrada com sucesso.");
    setSignRole(null);
  };

  return (
    <>
    <div
      data-viewer-chrome="shell"
      className="flex flex-col h-dvh min-h-0 bg-[#050505] text-white overflow-hidden print:hidden"
    >
      <ViewerTopBar
        data={doc}
        isAdmin={isAdmin}
        onDownload={() => downloadContractPdf()}
        onPrint={() => printContractDocument()}
        onShare={handleShare}
        onHistory={() => setModal("history")}
        onClose={handleClose}
        onOpenInfo={() => setInfoOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        <ViewerPagesPanel
          data={doc}
          currentPage={currentPage}
          open={pagesOpen}
          onToggle={() => setPagesOpen((v) => !v)}
          onPageChange={goToPage}
          overlay={isMobile}
        />

        <div className="relative flex-1 min-w-0 flex flex-col bg-[#0c0c0c] min-h-0">
          <main ref={scrollRef} className="relative flex-1 min-h-0 overflow-auto">
            {!isMobile ? (
            <div className="sticky top-0 z-10 flex justify-center pt-4 pb-2 pointer-events-none print:hidden">
              <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#111]/92 backdrop-blur-md px-1.5 py-1 shadow-lg">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors duration-200"
                  aria-label="Diminuir zoom"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[3rem] text-center text-[11px] tabular-nums text-white/60">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors duration-200"
                  aria-label="Aumentar zoom"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            ) : null}

            <div className={`flex justify-center py-6 pb-24 ${isMobile ? "px-3" : "px-10 xl:px-16"}`}>
              <div className="flex flex-col gap-8">
                {doc.pages.map((page) => (
                  <div
                    key={page.id}
                    data-page-id={page.id}
                    ref={(el) => {
                      if (el) pageRefs.current.set(page.id, el);
                      else pageRefs.current.delete(page.id);
                    }}
                    className="rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden mx-auto"
                    style={{
                      width: PAGE_CSS_W * (zoom / 100),
                      height: PAGE_CSS_H * (zoom / 100),
                    }}
                  >
                    <div
                      className="origin-top-left"
                      style={{
                        width: PAGE_CSS_W,
                        height: PAGE_CSS_H,
                        transform: `scale(${zoom / 100})`,
                      }}
                    >
                      <ContractPage
                        data={doc}
                        page={page}
                        pageNumber={page.id}
                        textScale={100}
                        onRequestSign={handleRequestSign}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Controle do sistema — flutuante sobre o doc; nunca vai para o PDF */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center print:hidden"
            data-viewer-chrome="page-nav"
            aria-hidden={false}
          >
            <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#111]/95 backdrop-blur-md px-2 py-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-colors duration-200"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[11px] tabular-nums text-white/55 min-w-[5.5rem] text-center">
                Página {currentPage} de {doc.totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= doc.totalPages}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-colors duration-200"
                aria-label="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <ViewerInfoPanel
          data={doc}
          isAdmin={isAdmin}
          onDownload={() => downloadContractPdf()}
          onRequestSign={handleRequestSign}
        />
        {isMobile && infoOpen ? (
          <ViewerInfoPanel
            data={doc}
            isAdmin={isAdmin}
            onDownload={() => downloadContractPdf()}
            onRequestSign={(role) => {
              setInfoOpen(false);
              handleRequestSign(role);
            }}
            variant="sheet"
            onClose={() => setInfoOpen(false)}
          />
        ) : null}
      </div>

      <SignatureFlowModal
        open={signRole != null}
        role={signRole ?? "cliente"}
        defaultName={
          signRole === "norax"
            ? doc.company.representative
            : doc.client.representative || doc.client.name
        }
        defaultDocument={
          signRole === "norax" ? doc.company.cnpj : doc.client.cpfCnpj
        }
        onClose={() => setSignRole(null)}
        onComplete={handleSignComplete}
      />

      {shareFeedback && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-white/[0.1] bg-[#151515] px-4 py-2 text-xs text-white/80 shadow-xl">
          Link seguro copiado
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)} />
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111] p-5 shadow-2xl"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Histórico</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/40"
                  onClick={() => setModal(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {modal === "history" && isAdmin && (
                <ul className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {doc.history.length === 0 ? (
                    <li className="text-xs text-white/40">Nenhuma alteração registrada.</li>
                  ) : (
                    doc.history.map((h) => (
                      <li
                        key={h.id}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                      >
                        <p className="text-xs text-white/80">{h.title}</p>
                        <p className="mt-1 text-[10px] text-white/40">
                          {h.responsible} · {h.date} {h.time}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <ContractPrintArea data={doc} />

    {isAdmin ? (
      <SendFormModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        formUrl={getContractSendDefaults(doc.id).publicUrl}
        formTitle={doc.title || doc.number}
        defaultPhone={getContractSendDefaults(doc.id).phone}
        defaultEmail={getContractSendDefaults(doc.id).email}
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
            const { contract } = await deliverContractInvite({
              contractId: doc.id,
              ...payload,
            });
            const next = toContractDocumentData(contract);
            setDoc(next);
            onDocumentChange?.(next);
            app?.invalidate();
            setSendOpen(false);
            setShareFeedback(true);
            window.setTimeout(() => setShareFeedback(false), 2000);
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

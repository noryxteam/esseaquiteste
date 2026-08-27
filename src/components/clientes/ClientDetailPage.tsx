"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Pencil, Sparkles } from "lucide-react";
import { getClienteById } from "@/lib/mock-data/clientes";
import { Avatar } from "@/components/clientes/Avatar";
import { Button } from "@/components/ui/button-shadcn";
import { formatCurrency } from "@/lib/utils";
import { routes } from "@/lib/app-routes";
import { getContractEditPath } from "@/lib/contract-routes";
import { getAllElectronicContracts } from "@/mock/electronic-contracts/store";
import { ClientSetupWizard } from "@/modules/client-setup/components/ClientSetupWizard";
import { clientSetupService } from "@/modules/client-setup/service";
import { formatPaymentLabel } from "@/modules/client-setup/store";
import { ClientFormsPanel } from "@/modules/client-forms/components/ClientFormsPanel";
import { countUnreviewedResponses } from "@/modules/client-forms/store";
import { useAppState } from "@/contexts/app-context";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

interface ClientDetailPageProps {
  clientId: string;
}

type ClientTab = "resumo" | "formularios";

export function ClientDetailPage({ clientId }: ClientDetailPageProps) {
  const router = useRouter();
  const { version, invalidate } = useAppState();
  const { showInfo } = useFeedback();
  const client = useMemo(
    () => getClienteById(clientId),
    [clientId, version]
  );

  const [wizardOpen, setWizardOpen] = useState(
    () => !clientSetupService.isComplete(clientId)
  );
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<ClientTab>("resumo");

  const setupComplete = clientSetupService.isComplete(clientId);
  const profile = clientSetupService.get(clientId);
  const clientContract = useMemo(() => {
    const list = getAllElectronicContracts().filter((c) => c.clienteId === clientId);
    return list[0] ?? null;
  }, [clientId, version]);

  const pendingForms = useMemo(
    () => countUnreviewedResponses(clientId),
    [clientId, version]
  );

  useEffect(() => {
    if (!client) return;
    if (!clientSetupService.isComplete(clientId)) {
      clientSetupService.ensureDraft(clientId, {
        empresa: client.name,
        email: client.email === "—" ? "" : client.email,
      });
      setWizardOpen(true);
    }
  }, [client, clientId]);

  // Pré-aquece o editor para o redirect após "Desenvolver Contrato" não travar no chunk
  useEffect(() => {
    if (!setupComplete || clientContract) return;
    void import("@/components/contracts/ContractEditPage");
  }, [setupComplete, clientContract]);

  if (!client) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(routes.clientes)}
          className="gap-1 -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <p className="text-muted-foreground">Cliente não encontrado.</p>
      </div>
    );
  }

  const handleDevelop = () => {
    if (!setupComplete) {
      showInfo("Conclua o assistente de configuração primeiro.");
      setWizardOpen(true);
      return;
    }
    if (creating) return;

    setCreating(true);
    try {
      // Cria localmente e navega já — sync com o banco não pode bloquear o editor
      const contract = clientSetupService.developContract(clientId);
      void import("@/modules/electronic-contracts/sync-api").then(
        ({ syncElectronicContractInBackground }) => {
          syncElectronicContractInBackground(contract);
        }
      );
      invalidate();
      router.push(getContractEditPath(contract.id));
    } catch (e) {
      setCreating(false);
      showInfo(e instanceof Error ? e.message : "Erro ao criar contrato.");
    }
  };

  const tabs: { id: ClientTab; label: string; badge?: number }[] = [
    { id: "resumo", label: "Resumo" },
    { id: "formularios", label: "Formulários", badge: pendingForms || undefined },
  ];

  return (
    <div className="space-y-6">
      {wizardOpen && (
        <ClientSetupWizard
          clientId={clientId}
          onComplete={() => {
            setWizardOpen(false);
            invalidate();
          }}
        />
      )}

      {creating && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 backdrop-blur-md">
              <motion.div
                className="max-w-md px-6 text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mx-auto mb-5 h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                </div>
                <p className="text-lg sm:text-xl font-medium text-white tracking-tight">
                  Criando o contrato
                </p>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  Você já será direcionado para finalizá-lo.
                </p>
                <div className="mt-8 mx-auto h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            </div>,
            document.body
          )
        : null}

      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 gap-1 text-muted-foreground">
          <Link href={routes.clientes}>
            <ArrowLeft className="h-4 w-4" />
            Clientes
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar initials={client.initials} />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {profile?.personal.empresa || client.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.personal.nome || client.contactName} ·{" "}
                {profile?.personal.email || client.email}
              </p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {setupComplete ? (
                  <span className="text-[10px] rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5">
                    Ficha configurada
                  </span>
                ) : (
                  <span className="text-[10px] rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 px-2 py-0.5">
                    Configuração pendente
                  </span>
                )}
                {pendingForms > 0 && (
                  <span className="text-[10px] rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 px-2 py-0.5">
                    {pendingForms} formulário{pendingForms > 1 ? "s" : ""} respondido
                    {pendingForms > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {setupComplete && clientContract && (
              <Button
                className="h-10 gap-2 bg-foreground text-accent-foreground hover:bg-foreground/90"
                onClick={() => router.push(getContractEditPath(clientContract.id))}
              >
                <FileText className="h-4 w-4" />
                Ver contrato
              </Button>
            )}
            {setupComplete && !clientContract && (
              <Button
                className="h-10 gap-2 bg-foreground text-accent-foreground hover:bg-foreground/90"
                onClick={handleDevelop}
                disabled={creating}
              >
                <Sparkles className="h-4 w-4" />
                Desenvolver Contrato
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-1.5 border-border-subtle"
              onClick={() => {
                clientSetupService.reopen(clientId);
                setWizardOpen(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              {setupComplete ? "Editar ficha" : "Continuar configuração"}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b border-border-subtle flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors",
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {t.label}
              {t.badge ? (
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 tabular-nums">
                  {t.badge}
                </span>
              ) : null}
            </span>
            {tab === t.id && (
              <span className="absolute left-0 right-0 bottom-0 h-px bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {tab === "formularios" ? (
        <ClientFormsPanel clientId={clientId} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
              <p className="text-[11px] text-muted-foreground">Projetos</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{client.projects}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
              <p className="text-[11px] text-muted-foreground">Valor do serviço</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {profile?.service.valorTotal
                  ? formatCurrency(profile.service.valorTotal)
                  : client.revenue > 0
                    ? formatCurrency(client.revenue)
                    : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
              <p className="text-[11px] text-muted-foreground">Último contato</p>
              <p className="mt-1 text-xl font-semibold">{client.lastContact}</p>
            </div>
          </div>

          {setupComplete && profile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Dados cadastrais</p>
                <Meta label="Documento" value={profile.personal.documento || "—"} />
                <Meta label="Telefone" value={profile.personal.telefone || "—"} />
                <Meta
                  label="Endereço"
                  value={`${profile.personal.endereco || "—"} · ${profile.personal.cidade}/${profile.personal.estado}`}
                />
              </div>
              <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Serviço e pagamento</p>
                <Meta label="Projeto" value={profile.service.nomeProjeto || "—"} />
                <Meta label="Gmail de notificação" value={profile.service.emailRecuperacao || "—"} />
                <Meta label="Pagamento" value={formatPaymentLabel(profile.payment)} />
                <Meta label="Responsável" value={profile.service.responsavelInternoNome || "—"} />
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contratos
            </p>
            <p className="text-sm text-muted-foreground">
              {!setupComplete
                ? "Conclua o assistente de configuração para liberar a criação de contratos."
                : clientContract
                  ? `Contrato ${clientContract.numeroContrato} vinculado a este cliente.`
                  : "Use Desenvolver Contrato para criar um documento vinculado a este cliente e escrever as cláusulas manualmente."}
            </p>
            {clientContract ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-border-subtle"
                onClick={() => router.push(getContractEditPath(clientContract.id))}
              >
                Abrir contrato
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild className="h-8 text-xs border-border-subtle">
                <Link href={routes.contratos}>Ver todos os contratos</Link>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-xs py-1.5 border-b border-border-subtle last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}

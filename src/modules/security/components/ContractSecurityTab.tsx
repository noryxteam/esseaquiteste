"use client";

import { useState } from "react";
import { Shield, Clock, Smartphone, KeyRound, Activity, Inbox } from "lucide-react";
import { useContractSecurity } from "@/modules/security/hooks/use-contract-security";
import { AuthorizedDevicesList } from "@/modules/security/components/AuthorizedDevicesList";
import { AccessCodesList } from "@/modules/security/components/AccessCodesList";
import { GenerateAccessModal } from "@/modules/security/components/GenerateAccessModal";
import { SecurityTimeline } from "@/modules/security/components/SecurityTimeline";
import { Button } from "@/components/ui/button-shadcn";

interface ContractSecurityTabProps {
  contractId: string;
}

function OverviewCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/40 p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-medium text-foreground tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function ContractSecurityTab({ contractId }: ContractSecurityTabProps) {
  const {
    overview,
    devices,
    codes,
    pendingRequests,
    authHistory,
    timeline,
    loading,
    error,
    renameDevice,
    revokeDevice,
    generateCode,
    cancelCode,
  } = useContractSecurity(contractId);

  const [generateOpen, setGenerateOpen] = useState(false);

  if (loading && !overview) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Carregando segurança...</p>;
  }

  if (error) {
    return <p className="text-sm text-state-red py-8 text-center">{error}</p>;
  }

  if (!overview) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-subtle bg-surface/40 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Segurança</h3>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Cliente</dt>
            <dd className="mt-0.5 font-medium">{overview.clientName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Empresa</dt>
            <dd className="mt-0.5 font-medium">{overview.companyName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Número</dt>
            <dd className="mt-0.5 font-mono">{overview.contractNumber}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-0.5">{overview.status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Dispositivos autorizados</dt>
            <dd className="mt-0.5 tabular-nums">{overview.authorizedDevicesCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Códigos ativos</dt>
            <dd className="mt-0.5 tabular-nums">{overview.activeCodesCount}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-muted-foreground">Último acesso</dt>
            <dd className="mt-0.5">{overview.lastAccessAt ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <OverviewCard
          label="Dispositivos"
          value={devices.filter((d) => d.statusRaw === "ACTIVE").length}
          icon={Smartphone}
        />
        <OverviewCard
          label="Códigos ativos"
          value={codes.filter((c) => c.statusRaw === "ACTIVE").length}
          icon={KeyRound}
        />
        <OverviewCard label="Pendentes" value={pendingRequests.length} icon={Inbox} />
        <OverviewCard label="Eventos" value={timeline.length} icon={Activity} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">Dispositivos autorizados</h3>
        <Button
          size="sm"
          className="h-9 gap-2 bg-foreground text-accent-foreground"
          onClick={() => setGenerateOpen(true)}
        >
          <KeyRound className="h-3.5 w-3.5" />
          Gerar novo acesso
        </Button>
      </div>

      <AuthorizedDevicesList devices={devices} onRename={renameDevice} onRevoke={revokeDevice} />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Solicitações pendentes</h3>
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border-subtle rounded-lg">
            Nenhuma solicitação pendente.
          </p>
        ) : (
          <ul className="space-y-2">
            {pendingRequests.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs"
              >
                <p className="font-medium text-foreground">{r.label}</p>
                <p className="text-muted-foreground mt-0.5">
                  {r.os} · {r.browser} · expira {r.expiresAt}
                </p>
                {r.notifiedEmail && (
                  <p className="text-muted-foreground mt-0.5">Notificado: {r.notifiedEmail}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <AccessCodesList codes={codes} onCancel={cancelCode} />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Histórico de autorizações</h3>
        {authHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border-subtle rounded-lg">
            Nenhum histórico ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {authHistory.slice(0, 20).map((h) => (
              <li
                key={h.id}
                className="rounded-lg border border-border-subtle bg-surface/40 px-4 py-3 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{h.label}</p>
                  <p className="text-muted-foreground mt-0.5">
                    {h.os} · {h.browser}
                    {h.permissionLabel ? ` · ${h.permissionLabel}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p>{h.status}</p>
                  <p className="text-muted-foreground mt-0.5">{h.decidedAt ?? h.createdAt}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <SecurityTimeline events={timeline} />

      <GenerateAccessModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerate={generateCode}
      />
    </div>
  );
}

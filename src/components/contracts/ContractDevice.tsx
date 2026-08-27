"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button-shadcn";
import { CheckCircle2, Monitor, Shield, ShieldX, Smartphone } from "lucide-react";

export type DeviceAccessPhase = "request" | "pending" | "approved" | "denied";

interface ContractDeviceProps {
  /** Número do contrato (vindo do banco via URL). */
  contractNumber?: string;
  onRequestAccess: () => void | Promise<void>;
  phase?: DeviceAccessPhase;
  notifiedEmail?: string | null;
  emailSent?: boolean | null;
  pendingApproval?: boolean;
  error?: string;
  loading?: boolean;
  /** @deprecated Prefer contractNumber — mantido para telas admin locais. */
  contract?: {
    numeroContrato?: string;
    dispositivosAutorizados?: { label?: string }[];
    accessCodeUsed?: boolean;
  };
}

export function ContractDevice({
  contractNumber,
  contract,
  onRequestAccess,
  phase = "request",
  notifiedEmail,
  emailSent,
  pendingApproval,
  error: externalError,
  loading: externalLoading,
}: ContractDeviceProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const number = contractNumber ?? contract?.numeroContrato ?? "";
  const authorizedDevices = contract?.dispositivosAutorizados ?? [];
  const needsAccess = authorizedDevices.length === 0 || !contract;
  const effectivePhase: DeviceAccessPhase =
    phase !== "request"
      ? phase
      : pendingApproval
        ? "pending"
        : "request";

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await onRequestAccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (effectivePhase === "pending") {
    return (
      <div className="rounded-xl border border-white/20 bg-white/[0.03] p-6 text-center max-w-md mx-auto">
        <Smartphone className="h-10 w-10 text-white/80 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Aguardando autorização</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Enviamos um pedido de autorização
          {notifiedEmail ? (
            <>
              {" "}
              para <span className="text-foreground/90">{notifiedEmail}</span>
            </>
          ) : (
            " para o e-mail do proprietário do contrato"
          )}
          . Use <strong>Autorizar</strong> ou <strong>Negar</strong> no e-mail.
        </p>
        {emailSent === false && (
          <p className="text-xs text-state-red mt-3">
            O e-mail não saiu do servidor (SMTP do Gmail rejeitou a senha). Atualize MAIL_PASSWORD
            no backend/.env com uma senha de app válida.
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-4 animate-pulse">Aguardando resposta…</p>
      </div>
    );
  }

  if (effectivePhase === "denied") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center max-w-md mx-auto">
        <ShieldX className="h-10 w-10 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Você não foi autorizado</h3>
        <p className="text-sm text-muted-foreground mt-2">
          O acesso a este contrato foi negado. Entre em contato com a Norax se precisar de ajuda.
        </p>
      </div>
    );
  }

  if (effectivePhase === "approved") {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center max-w-md mx-auto">
        <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Você foi autorizado com sucesso</h3>
        <p className="text-sm text-muted-foreground mt-2">Abrindo o contrato…</p>
      </div>
    );
  }

  if (!needsAccess && authorizedDevices.length > 0) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-3">
        <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <p className="text-sm font-medium">Dispositivo autorizado</p>
          <p className="text-xs text-muted-foreground">
            {authorizedDevices[0]?.label ?? "Navegador"} — acesso liberado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface/60 p-6 max-w-md mx-auto space-y-5">
      <div className="text-center">
        <Monitor className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Validação do dispositivo</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Peça autorização para entrar no contrato
          {number ? (
            <>
              {" "}
              <span className="font-mono text-foreground/80">{number}</span>
            </>
          ) : null}
          .
        </p>
      </div>
      {(error || externalError) && (
        <p className="text-xs text-state-red text-center">{error || externalError}</p>
      )}
      <Button
        className="w-full h-11 bg-white text-black hover:bg-white/90"
        onClick={() => void handleSubmit()}
        disabled={loading || externalLoading}
      >
        {loading || externalLoading ? "Enviando pedido…" : "Pedir autorização"}
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import { portalApi } from "@/modules/security/api/security.api";
import {
  DevicePermission,
  type DeviceAuthorizationPanel,
} from "@/modules/security/types";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface DeviceAuthorizationPageProps {
  token: string;
}

/** Página pública mínima — só permissão. Sem menu, dashboard ou códigos. */
export function DeviceAuthorizationPage({ token }: DeviceAuthorizationPageProps) {
  const [panel, setPanel] = useState<DeviceAuthorizationPanel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [permission, setPermission] = useState<DevicePermission | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{
    status: "APPROVED" | "DENIED";
    permissionLabel?: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await portalApi.getAuthorizationPanel(token);
        if (!cancelled) setPanel(res.data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Não foi possível carregar a solicitação.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleAuthorize = async () => {
    if (!permission) {
      setError("Selecione a permissão do dispositivo.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await portalApi.authorizeFromPanel(token, { permission });
      setDone({
        status: res.data.status,
        permissionLabel: res.data.permissionLabel,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao autorizar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-sm text-white/50">Carregando…</p>
      </div>
    );
  }

  if (error && !panel) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-3">
          <ShieldX className="h-8 w-8 text-red-400 mx-auto" />
          <h1 className="text-lg font-medium">Solicitação indisponível</h1>
          <p className="text-sm text-white/50">{error}</p>
        </div>
      </div>
    );
  }

  if (!panel) return null;

  if (done) {
    const ok = done.status === "APPROVED";
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-3">
          {ok ? (
            <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto" />
          ) : (
            <ShieldX className="h-8 w-8 text-red-400 mx-auto" />
          )}
          <h1 className="text-lg font-medium">
            {ok ? "Dispositivo autorizado" : "Acesso negado"}
          </h1>
          {ok && done.permissionLabel && (
            <p className="text-sm text-white/50">
              Permissão: <span className="text-white">{done.permissionLabel}</span>
            </p>
          )}
          {ok && (
            <p className="text-sm text-white/45">
              O dispositivo solicitante será liberado automaticamente.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!panel.canDecide) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-2">
          <h1 className="text-lg font-medium">Solicitação já processada</h1>
          <p className="text-sm text-white/50">Status: {panel.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-xl font-semibold tracking-tight">Autorizar dispositivo</h1>

        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-white/45">Dispositivo</dt>
            <dd className="mt-0.5 font-medium">{panel.device.os}</dd>
          </div>
          <div>
            <dt className="text-white/45">Navegador</dt>
            <dd className="mt-0.5 font-medium">{panel.device.browser}</dd>
          </div>
          <div>
            <dt className="text-white/45">Contrato</dt>
            <dd className="mt-0.5 font-medium font-mono">{panel.contractNumber}</dd>
          </div>
        </dl>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium mb-1">Escolha a permissão</legend>
          {panel.permissions.map((p) => (
            <label
              key={p.id}
              className={cn(
                "block rounded-lg border px-4 py-3.5 cursor-pointer transition-colors",
                permission === p.id
                  ? "border-white/40 bg-white/5"
                  : "border-white/10 hover:border-white/25"
              )}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="permission"
                  checked={permission === p.id}
                  onChange={() => setPermission(p.id)}
                  className="mt-1 accent-white"
                />
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-white/45 mt-1 leading-relaxed">{p.description}</p>
                </div>
              </div>
            </label>
          ))}
        </fieldset>

        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <Button
          className="w-full h-11 bg-white text-black hover:bg-white/90"
          disabled={submitting || !permission}
          onClick={() => void handleAuthorize()}
        >
          {submitting ? "Autorizando…" : "Autorizar dispositivo"}
        </Button>
      </div>
    </div>
  );
}

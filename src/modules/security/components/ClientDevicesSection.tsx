"use client";

import { useEffect, useState } from "react";
import { Plus, Smartphone } from "lucide-react";
import { portalApi } from "@/modules/security/api/security.api";
import { getDeviceFingerprint, getPortalToken } from "@/modules/security/services/device-fingerprint";
import type { ClientDevice } from "@/modules/security/types";
import { Button } from "@/components/ui/button-shadcn";

interface ClientDevicesSectionProps {
  slug: string;
}

export function ClientDevicesSection({ slug }: ClientDevicesSectionProps) {
  const [devices, setDevices] = useState<ClientDevice[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const token = getPortalToken(slug);
    if (!token) return;
    try {
      const res = await portalApi.getClientDevices(slug, getDeviceFingerprint(), token);
      setDevices(res.data.devices);
      setCount(res.data.connectedCount);
    } catch {
      // Sessão inválida — seção oculta
    }
  };

  useEffect(() => {
    void load();
  }, [slug]);

  const handleAddDevice = async () => {
    const token = getPortalToken(slug);
    if (!token) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await portalApi.requestDeviceCode(slug, getDeviceFingerprint(), token);
      setMessage(res.data.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao solicitar código");
    } finally {
      setLoading(false);
    }
  };

  const token = typeof window !== "undefined" ? getPortalToken(slug) : null;
  if (!token) return null;

  return (
    <div className="border-t border-border-subtle bg-surface/20 py-6 px-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Dispositivos</h3>
          <span className="text-xs text-muted-foreground ml-auto">{count} conectado(s)</span>
        </div>

        {devices.length > 0 && (
          <ul className="space-y-2">
            {devices.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between text-xs rounded-lg border border-border-subtle px-3 py-2"
              >
                <span className={d.isCurrent ? "font-medium" : ""}>
                  {d.label}
                  {d.isCurrent && <span className="text-muted-foreground ml-1">(atual)</span>}
                </span>
                <span className="text-muted-foreground tabular-nums">{d.lastAccess}</span>
              </li>
            ))}
          </ul>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full h-9 gap-2"
          onClick={handleAddDevice}
          disabled={loading}
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar dispositivo
        </Button>

        {message && <p className="text-xs text-muted-foreground text-center">{message}</p>}
        {error && <p className="text-xs text-state-red text-center">{error}</p>}
        <p className="text-[10px] text-muted-foreground text-center">
          O código será enviado para o e-mail cadastrado. Nunca será exibido nesta tela.
        </p>
      </div>
    </div>
  );
}

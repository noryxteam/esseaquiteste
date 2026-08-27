"use client";

import { useState } from "react";
import { Monitor, Pencil, Plus, Shield, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useTrustedDevices } from "@/modules/security/hooks/use-trusted-devices";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

export function TrustedDevicesSettings() {
  const {
    devices,
    loading,
    error,
    currentTrusted,
    registerCurrent,
    rename,
    revoke,
    restore,
    remove,
  } = useTrustedDevices();
  const { showSuccess, showInfo } = useFeedback();
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [registering, setRegistering] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await registerCurrent(newLabel.trim() || undefined);
      setNewLabel("");
      showSuccess("Dispositivo registrado como confiável.");
    } catch (e) {
      showInfo(e instanceof Error ? e.message : "Não foi possível registrar o dispositivo.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando dispositivos...</p>;
  }

  if (error) {
    return <p className="text-sm text-state-red">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-subtle bg-surface/40 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Dispositivos Confiáveis</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Dispositivos com acesso nunca solicitam código para contratos, financeiro, arquivos
          protegidos e áreas administrativas. Use &quot;Tirar acesso&quot; para bloquear sem apagar o
          registro, ou &quot;Apagar&quot; para remover de vez.
        </p>

        {!currentTrusted && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Nome amigável (ex: MacBook do Murilo)"
              className="h-9 text-xs flex-1"
            />
            <Button
              size="sm"
              className="h-9 gap-2 bg-foreground text-accent-foreground shrink-0"
              onClick={() => void handleRegister()}
              disabled={registering}
            >
              <Plus className="h-3.5 w-3.5" />
              Registrar este dispositivo
            </Button>
          </div>
        )}

        {currentTrusted && (
          <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
            <Monitor className="h-3.5 w-3.5" />
            Este dispositivo já está na lista de confiáveis.
          </p>
        )}
      </div>

      {devices.length === 0 && (
        <p className="text-xs text-muted-foreground">Nenhum dispositivo cadastrado.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {devices.map((device) => {
          const isActive = device.statusRaw === "ACTIVE";
          return (
            <div
              key={device.id}
              className={cn(
                "rounded-lg border border-border-subtle bg-surface/40 p-4 space-y-2",
                !isActive && "opacity-70"
              )}
            >
              {editingId === device.id ? (
                <div className="flex gap-2">
                  <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={async () => {
                      await rename(device.id, editLabel);
                      setEditingId(null);
                      showSuccess("Dispositivo renomeado.");
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{device.label}</p>
                  <span
                    className={cn(
                      "text-[10px] rounded-full px-2 py-0.5 border shrink-0",
                      isActive
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-border-subtle text-muted-foreground"
                    )}
                  >
                    {device.status}
                  </span>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">
                {device.deviceType} · {device.os} · {device.browser}
              </p>
              <p className="text-[10px] text-muted-foreground tabular-nums">
                Último acesso: {device.lastAccess}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {isActive && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setEditingId(device.id);
                        setEditLabel(device.label);
                      }}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Renomear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1"
                      disabled={busyId === device.id}
                      onClick={async () => {
                        setBusyId(device.id);
                        try {
                          await revoke(device.id);
                          showSuccess("Acesso removido. O dispositivo permanece na lista.");
                        } catch (e) {
                          showInfo(e instanceof Error ? e.message : "Erro ao tirar acesso.");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      <ShieldOff className="h-3 w-3" />
                      Tirar acesso
                    </Button>
                  </>
                )}

                {!isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    disabled={busyId === device.id}
                    onClick={async () => {
                      setBusyId(device.id);
                      try {
                        await restore(device.id);
                        showSuccess("Acesso restaurado.");
                      } catch (e) {
                        showInfo(e instanceof Error ? e.message : "Erro ao restaurar.");
                      } finally {
                        setBusyId(null);
                      }
                    }}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Restaurar acesso
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1 text-state-red border-state-red/30"
                  disabled={busyId === device.id}
                  onClick={async () => {
                    if (!window.confirm(`Apagar permanentemente "${device.label}"?`)) return;
                    setBusyId(device.id);
                    try {
                      await remove(device.id);
                      showSuccess("Dispositivo apagado.");
                    } catch (e) {
                      showInfo(e instanceof Error ? e.message : "Erro ao apagar.");
                    } finally {
                      setBusyId(null);
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                  Apagar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

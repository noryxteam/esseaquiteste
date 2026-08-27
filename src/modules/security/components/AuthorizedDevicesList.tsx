"use client";

import { useState } from "react";
import { Eye, MoreVertical, Pencil, ShieldOff } from "lucide-react";
import type { AuthorizedDevice } from "@/modules/security/types";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import { DeviceDetailsDialog } from "@/modules/security/components/DeviceDetailsDialog";

interface AuthorizedDevicesListProps {
  devices: AuthorizedDevice[];
  onRename: (deviceId: string, label: string) => Promise<void>;
  onRevoke: (deviceId: string) => Promise<void>;
}

export function AuthorizedDevicesList({ devices, onRename, onRevoke }: AuthorizedDevicesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const startRename = (device: AuthorizedDevice) => {
    setEditingId(device.id);
    setEditLabel(device.label);
  };

  const saveRename = async (deviceId: string) => {
    setLoading(deviceId);
    try {
      await onRename(deviceId, editLabel.trim());
      setEditingId(null);
    } finally {
      setLoading(null);
    }
  };

  const handleRevoke = async (deviceId: string) => {
    if (!confirm("Revogar acesso deste dispositivo? Será necessário um novo código na próxima visita.")) return;
    setLoading(deviceId);
    try {
      await onRevoke(deviceId);
    } finally {
      setLoading(null);
    }
  };

  if (devices.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border-subtle rounded-lg">
        Nenhum dispositivo autorizado ainda.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className={cn(
              "rounded-lg border border-border-subtle bg-surface/40 p-4 space-y-3",
              device.statusRaw === "REVOKED" && "opacity-60"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {editingId === device.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button size="sm" className="h-8" onClick={() => saveRename(device.id)} disabled={loading === device.id}>
                      Salvar
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm font-medium truncate">{device.label}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {device.deviceType} · {device.os} · {device.browser}
                </p>
                <p className="text-[10px] text-foreground/80 mt-1">
                  Permissão: {device.permissionLabel ?? device.permission ?? "—"}
                </p>
              </div>
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full shrink-0",
                  device.statusRaw === "ACTIVE"
                    ? "bg-white/10 text-foreground"
                    : "bg-white/5 text-muted-foreground"
                )}
              >
                {device.status}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <dt className="text-muted-foreground">Primeiro acesso</dt>
                <dd className="mt-0.5 tabular-nums">{device.firstAccess}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Último acesso</dt>
                <dd className="mt-0.5 tabular-nums">{device.lastAccess}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">IP</dt>
                <dd className="mt-0.5 font-mono">{device.ip}</dd>
              </div>
            </dl>

            {device.statusRaw === "ACTIVE" && (
              <div className="flex gap-2 pt-1 border-t border-border-subtle">
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={() => startRename(device)}>
                  <Pencil className="h-3 w-3 mr-1" />
                  Renomear
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1" onClick={() => setDetailsId(device.id)}>
                  <Eye className="h-3 w-3 mr-1" />
                  Detalhes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs text-state-red hover:text-state-red"
                  onClick={() => handleRevoke(device.id)}
                  disabled={loading === device.id}
                >
                  <ShieldOff className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {detailsId && (
        <DeviceDetailsDialog
          device={devices.find((d) => d.id === detailsId) ?? null}
          onClose={() => setDetailsId(null)}
        />
      )}
    </>
  );
}

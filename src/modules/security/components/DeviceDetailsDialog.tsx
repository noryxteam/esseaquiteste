"use client";

import type { AuthorizedDevice } from "@/modules/security/types";
import { Button } from "@/components/ui/button-shadcn";
import { X } from "lucide-react";

interface DeviceDetailsDialogProps {
  device: AuthorizedDevice | null;
  onClose: () => void;
}

export function DeviceDetailsDialog({ device, onClose }: DeviceDetailsDialogProps) {
  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-border-subtle bg-background p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Detalhes do dispositivo</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <dl className="space-y-3 text-xs">
          {[
            ["Nome", device.label],
            ["Sistema", device.os],
            ["Navegador", device.browser],
            ["Tipo", device.deviceType],
            ["Primeiro acesso", device.firstAccess],
            ["Último acesso", device.lastAccess],
            ["IP", device.ip],
            ["Status", device.status],
            ["Acesso permanente", device.sessionOnly ? "Não" : "Sim"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2 border-b border-border-subtle last:border-0">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

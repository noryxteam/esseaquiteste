"use client";

import { Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";

interface TrustDevicePromptProps {
  onTrust: (trust: boolean) => void;
  loading?: boolean;
}

export function TrustDevicePrompt({ onTrust, loading }: TrustDevicePromptProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface/60 p-6 max-w-md mx-auto text-center space-y-4">
      <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto">
        <Smartphone className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold">Deseja confiar neste dispositivo?</h3>
      <p className="text-sm text-muted-foreground">
        Se confiar, nas próximas visitas não será necessário informar um novo código.
        Se não confiar, o acesso será válido apenas nesta sessão.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button
          className="flex-1 h-11 bg-foreground text-accent-foreground"
          onClick={() => onTrust(true)}
          disabled={loading}
        >
          <Shield className="h-4 w-4 mr-2" />
          Sim, confiar
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-11"
          onClick={() => onTrust(false)}
          disabled={loading}
        >
          Não, apenas esta sessão
        </Button>
      </div>
    </div>
  );
}

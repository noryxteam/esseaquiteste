import { Fingerprint, Lock, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const INDICATORS = [
  { icon: Shield, label: "Documento protegido" },
  { icon: ShieldCheck, label: "Integridade verificada" },
  { icon: Fingerprint, label: "Assinatura eletrônica" },
  { icon: Lock, label: "Criptografia ativa" },
] as const;

interface ContractSecurityProps {
  className?: string;
  compact?: boolean;
}

export function ContractSecurity({ className, compact }: ContractSecurityProps) {
  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2", className)}>
      {INDICATORS.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 rounded-md border border-border-subtle bg-surface/40 px-3 py-2"
        >
          <item.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

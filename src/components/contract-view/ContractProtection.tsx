import { Shield } from "lucide-react";

export function ContractProtection() {
  return (
    <div className="flex items-start gap-2 text-[8px] text-[#71717a] leading-snug max-w-[180px]">
      <Shield className="h-3 w-3 shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-[#52525b]">Documento protegido e criptografado</p>
        <p className="mt-0.5">Validade jurídica conforme MP 2.200-2/2001</p>
      </div>
    </div>
  );
}

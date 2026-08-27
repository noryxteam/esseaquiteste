"use client";

import type { ElectronicContract } from "@/modules/electronic-contracts";
import { Shield } from "lucide-react";

interface ContractSecurityProps {
  contract: ElectronicContract;
}

export function ContractSecurity({ contract }: ContractSecurityProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface/40 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Segurança</h3>
      </div>
      <dl className="space-y-2 text-xs">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Versão</dt>
          <dd>v{contract.versao}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Hash do documento</dt>
          <dd className="font-mono truncate max-w-[180px]">{contract.hashDocumento || "—"}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Dispositivos autorizados</dt>
          <dd>{contract.dispositivosAutorizados.length}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Código utilizado</dt>
          <dd>{contract.accessCodeUsed ? "Sim" : "Não"}</dd>
        </div>
      </dl>
      {contract.securityLogs.length > 0 && (
        <div className="pt-2 border-t border-border-subtle space-y-1 max-h-32 overflow-y-auto">
          {contract.securityLogs.slice(0, 5).map((log) => (
            <p key={log.id} className="text-[10px] text-muted-foreground">
              {log.data} {log.hora} — {log.acao}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

interface ContractHistoryProps {
  contract: ElectronicContract;
}

export function ContractHistory({ contract }: ContractHistoryProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface/40 p-4">
      <h3 className="text-sm font-semibold mb-3">Histórico</h3>
      <ul className="space-y-2">
        {contract.timeline.map((t) => (
          <li key={t.id} className="text-xs border-b border-border-subtle pb-2 last:border-0">
            <span className="font-medium">{t.titulo}</span>
            <span className="text-muted-foreground block mt-0.5">
              {t.data} {t.hora} — {t.usuario}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

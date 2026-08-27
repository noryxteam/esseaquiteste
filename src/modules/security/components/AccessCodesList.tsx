"use client";

import { useState } from "react";
import type { AccessCode } from "@/modules/security/types";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface AccessCodesListProps {
  codes: AccessCode[];
  onCancel: (codeId: string) => Promise<void>;
}

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-white/10 text-foreground",
  USED: "bg-white/5 text-muted-foreground",
  EXPIRED: "bg-white/5 text-muted-foreground",
  CANCELLED: "bg-white/5 text-muted-foreground line-through",
};

export function AccessCodesList({ codes, onCancel }: AccessCodesListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCancel = async (codeId: string) => {
    if (!confirm("Cancelar este código?")) return;
    setLoading(codeId);
    try {
      await onCancel(codeId);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Códigos gerados</h3>
      {codes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border-subtle rounded-lg">
          Nenhum código gerado.
        </p>
      ) : (
        <div className="rounded-lg border border-border-subtle overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-surface/40 text-muted-foreground">
                <th className="text-left px-4 py-2 font-medium">Código</th>
                <th className="text-left px-4 py-2 font-medium">Criação</th>
                <th className="text-left px-4 py-2 font-medium">Expiração</th>
                <th className="text-left px-4 py-2 font-medium">Criado por</th>
                <th className="text-left px-4 py-2 font-medium">Permissão</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-3 font-mono">{code.codeHint}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{code.createdAt}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{code.expiresAt}</td>
                  <td className="px-4 py-3">{code.createdBy}</td>
                  <td className="px-4 py-3">{code.permissionLabel ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", STATUS_STYLE[code.statusRaw])}>
                      {code.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {code.statusRaw === "ACTIVE" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] text-muted-foreground"
                        onClick={() => handleCancel(code.id)}
                        disabled={loading === code.id}
                      >
                        Cancelar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

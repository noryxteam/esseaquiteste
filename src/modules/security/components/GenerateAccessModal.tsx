"use client";

import { useState } from "react";
import { Copy, X } from "lucide-react";
import type { CodeValidity, GeneratedAccessCode } from "@/modules/security/types";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

const VALIDITY_OPTIONS: { id: CodeValidity; label: string }[] = [
  { id: "30m", label: "30 minutos" },
  { id: "1h", label: "1 hora" },
  { id: "6h", label: "6 horas" },
  { id: "24h", label: "24 horas" },
  { id: "custom", label: "Personalizado" },
];

interface GenerateAccessModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (validity: CodeValidity, customMinutes?: number) => Promise<GeneratedAccessCode>;
}

export function GenerateAccessModal({ open, onClose, onGenerate }: GenerateAccessModalProps) {
  const [validity, setValidity] = useState<CodeValidity>("1h");
  const [customMinutes, setCustomMinutes] = useState("120");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GeneratedAccessCode | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await onGenerate(
        validity,
        validity === "custom" ? Number(customMinutes) : undefined
      );
      setGenerated(result);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generated?.code) return;
    await navigator.clipboard.writeText(generated.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGenerated(null);
    setValidity("1h");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-border-subtle bg-background p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Gerar novo acesso</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!generated ? (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Validade do código:</p>
            <div className="grid grid-cols-2 gap-2">
              {VALIDITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setValidity(opt.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs text-left transition-colors",
                    validity === opt.id
                      ? "border-foreground bg-white/10 text-foreground"
                      : "border-border-subtle text-muted-foreground hover:border-border"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {validity === "custom" && (
              <label className="block text-xs">
                <span className="text-muted-foreground">Minutos</span>
                <Input
                  type="number"
                  min={5}
                  max={10080}
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="mt-1 h-9"
                />
              </label>
            )}

            <Button
              className="w-full h-10 bg-foreground text-accent-foreground"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Gerando..." : "Confirmar"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-xs text-muted-foreground">Código gerado (uso único):</p>
            <p className="text-2xl font-mono font-semibold tracking-wider">{generated.code}</p>
            <p className="text-[10px] text-muted-foreground">
              Expira em {generated.expiresAt}
            </p>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copiado!" : "Copiar código"}
            </Button>
            <p className="text-[10px] text-state-orange">
              Este código só será exibido uma vez. Guarde-o com segurança.
            </p>
            <Button className="w-full h-10" onClick={handleClose}>
              Fechar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

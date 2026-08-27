"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { Checkbox } from "@/components/ui/checkbox";
import { PenLine } from "lucide-react";

interface ContractSignatureProps {
  onSign: (data: {
    nome: string;
    documento: string;
    data: string;
    hora: string;
    aceiteEletronico: boolean;
  }) => void | Promise<void>;
  disabled?: boolean;
}

export function ContractSignature({ onSign, disabled }: ContractSignatureProps) {
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [aceite, setAceite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const now = new Date();
  const data = now.toLocaleDateString("pt-BR");
  const hora = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const handleSign = async () => {
    if (!aceite) {
      setError("É necessário aceitar os termos eletrônicos");
      return;
    }
    if (!nome.trim() || !documento.trim()) {
      setError("Preencha nome e CPF/CNPJ");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSign({ nome, documento, data, hora, aceiteEletronico: aceite });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao assinar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface/60 p-6 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <PenLine className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Assinatura eletrônica</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div>
          <span className="block uppercase tracking-wider text-[10px]">Data</span>
          <span className="text-foreground">{data}</span>
        </div>
        <div>
          <span className="block uppercase tracking-wider text-[10px]">Hora</span>
          <span className="text-foreground">{hora}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">Nome completo</label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={disabled || loading}
            className="mt-1 h-10"
            placeholder="Seu nome completo"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">CPF ou CNPJ</label>
          <Input
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            disabled={disabled || loading}
            className="mt-1 h-10"
            placeholder="000.000.000-00"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(v === true)} disabled={disabled} />
        <span className="text-xs text-muted-foreground leading-relaxed">
          Declaro que li e concordo com todos os termos deste contrato, autorizando a assinatura eletrônica
          com validade jurídica conforme a legislação vigente.
        </span>
      </label>

      {error && <p className="text-xs text-state-red">{error}</p>}

      <Button
        onClick={handleSign}
        disabled={disabled || loading}
        className="w-full h-11 bg-foreground text-accent-foreground hover:bg-foreground/90"
      >
        Assinar contrato
      </Button>
    </div>
  );
}

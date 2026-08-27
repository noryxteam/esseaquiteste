"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  Copy,
  DollarSign,
  FileText,
  KeyRound,
  Send,
  Users,
} from "lucide-react";
import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import { electronicContractService } from "@/modules/electronic-contracts";

interface ContractStatusCardsProps {
  data: ContractViewData;
}

export function ContractStatusCards({ data }: ContractStatusCardsProps) {
  const electronic =
    electronicContractService.getById(data.id) ??
    electronicContractService.getById(data.uniqueSlug || "");
  const accessCode = data.accessCode || electronic?.accessCode || null;

  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!accessCode) return;
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const cards = [
    {
      icon: DollarSign,
      label: "Valor do contrato",
      value: data.value,
      sub: data.installments,
    },
    {
      icon: Calendar,
      label: "Data de criação",
      value: data.createdAt,
      sub: data.createdTime,
    },
    {
      icon: Send,
      label: "Data de envio",
      value: data.sentAt,
      sub: data.sentTime,
    },
    {
      icon: FileText,
      label: "Modelo utilizado",
      value: data.template,
      sub: "",
    },
    {
      icon: Users,
      label: "Assinaturas",
      value: `${data.signaturesCount} de ${data.signaturesTotal}`,
      sub: data.signaturesCount < data.signaturesTotal ? "Pendentes" : "Concluídas",
    },
    {
      icon: KeyRound,
      label: "Código de segurança do cliente",
      value: accessCode || "Ainda não gerado",
      sub: accessCode ? "Envie este código ao cliente" : "Será gerado na criação",
      mono: true,
      copyable: Boolean(accessCode),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-border-subtle bg-surface/60 p-3.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">{card.label}</p>
              <p
                className={`mt-1 text-sm font-medium text-foreground truncate ${
                  card.mono ? "font-mono text-[11px] tracking-wide" : ""
                }`}
              >
                {card.value}
              </p>
              {card.sub && (
                <p className="mt-0.5 text-[10px] text-muted-foreground">{card.sub}</p>
              )}
            </div>
            {card.copyable ? (
              <button
                type="button"
                onClick={() => void handleCopyCode()}
                className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/15 transition-colors"
                title="Copiar código"
                aria-label="Copiar código de segurança"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-state-green" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-white" />
                )}
              </button>
            ) : (
              <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                <card.icon className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

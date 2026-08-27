"use client";

import {
  CheckCircle2,
  Clock,
  PenLine,
  User,
} from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import type { ContractSignature } from "@/lib/mock-data/contract-view-types";
import { Button } from "@/components/ui/button-shadcn";
import { NoraxLogo } from "@/components/brand/NoraxLogo";
import { cn } from "@/lib/utils";

interface ViewerSignaturesCardProps {
  data: ContractDocumentData;
  isAdmin: boolean;
  onRequestSign: (role: "norax" | "cliente") => void;
}

function Slot({
  sig,
  partyLabel,
  company,
  role,
  onRequestSign,
}: {
  sig?: ContractSignature;
  partyLabel: string;
  company: string;
  role: "norax" | "cliente";
  onRequestSign: (role: "norax" | "cliente") => void;
}) {
  const signed = sig?.status === "assinado";

  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2.5 transition-colors duration-200",
        signed
          ? "border-emerald-500/20 bg-emerald-500/[0.06]"
          : "border-white/[0.06] bg-white/[0.02]"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden",
            role === "norax" ? "bg-transparent" : "bg-white/10 text-white/60"
          )}
        >
          {role === "norax" ? (
            <NoraxLogo invert className="h-5 w-auto" />
          ) : (
            <User className="h-3.5 w-3.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium text-white/85 truncate">{company || partyLabel}</p>
            {signed ? (
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400/90 shrink-0">
                <CheckCircle2 className="h-3 w-3" />
                Assinado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] text-amber-400/80 shrink-0">
                <Clock className="h-3 w-3" />
                Pendente
              </span>
            )}
          </div>
          {signed ? (
            <p className="mt-0.5 text-[10px] text-white/40 truncate">
              {sig?.name}
              {sig?.date ? ` · ${sig.date}${sig.time ? ` às ${sig.time}` : ""}` : ""}
            </p>
          ) : (
            <Button
              type="button"
              size="sm"
              className="mt-2 h-7 w-full gap-1.5 text-[10px] bg-white text-black hover:bg-white/90"
              onClick={() => onRequestSign(role)}
            >
              <PenLine className="h-3 w-3" />
              Assinar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ViewerSignaturesCard({
  data,
  onRequestSign,
}: Omit<ViewerSignaturesCardProps, "isAdmin"> & { isAdmin?: boolean }) {
  const norax = data.signatures.find((s) => s.role === "empresa");
  const cliente = data.signatures.find((s) => s.role === "cliente");
  const done = [norax, cliente].filter((s) => s?.status === "assinado").length;
  const total = 2;
  const pct = Math.round((done / total) * 100);
  const allDone = done === total;

  return (
    <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-white">Assinaturas</h2>
        <span className="text-[10px] text-white/40">
          {done} de {total}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-emerald-400/80 transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2">
        <Slot
          sig={norax}
          partyLabel="Norax"
          company={data.company.legalName || data.company.name}
          role="norax"
          onRequestSign={onRequestSign}
        />
        <Slot
          sig={cliente}
          partyLabel="Cliente"
          company={data.client.company || data.client.name}
          role="cliente"
          onRequestSign={onRequestSign}
        />
      </div>

      {allDone && (
        <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-2.5">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Documento totalmente assinado
          </p>
          <p className="mt-1 text-[10px] text-emerald-400/60 leading-relaxed">
            Todas as partes concluíram. Validade jurídica ativa.
          </p>
        </div>
      )}
    </section>
  );
}

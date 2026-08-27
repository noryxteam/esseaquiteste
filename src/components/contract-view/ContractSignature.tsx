"use client";

import {
  Building2,
  CheckCircle2,
  Clock,
  PenLine,
  ShieldCheck,
  User,
} from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import type { ContractSignature as SigType } from "@/lib/mock-data/contract-view-types";
import { Button } from "@/components/ui/button-shadcn";
import { NoraxLogo } from "@/components/brand/NoraxLogo";
import { cn } from "@/lib/utils";

interface ContractSignatureProps {
  data: ContractDocumentData;
  textScale?: number;
  onRequestSign?: (role: "norax" | "cliente") => void;
}

function PartyCard({
  sig,
  role,
  title,
  document,
  sentLabel,
  onSign,
}: {
  sig?: SigType;
  role: "norax" | "cliente";
  title: string;
  document: string;
  sentLabel?: string;
  onSign?: () => void;
}) {
  const signed = sig?.status === "assinado";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        signed
          ? "border-emerald-500/25 bg-emerald-50/90"
          : "border-[#e4e4e7] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      )}
    >
      <div className="mb-4">
        {signed ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            ASSINADO
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-amber-700">
            <Clock className="h-3 w-3" />
            PENDENTE
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "h-11 w-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden",
            role === "norax" ? "bg-[#18181b]" : "bg-[#f4f4f5] text-[#71717a]"
          )}
        >
          {role === "norax" ? (
            <NoraxLogo invert className="h-6 w-auto" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#18181b] truncate">{title}</p>
          <p className="text-[11px] text-[#71717a]">{document || "—"}</p>
        </div>
      </div>

      {signed ? (
        <>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#52525b] mb-4">
            <span>
              {sig?.date}
              {sig?.time ? ` às ${sig.time}` : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              {sig?.name}
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            </span>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-emerald-800">
                Documento assinado digitalmente
              </p>
              <p className="text-[10px] text-emerald-700/70 mt-0.5">
                Assinatura com validade jurídica
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {sentLabel && (
            <p className="text-[11px] text-[#71717a] mb-4">{sentLabel}</p>
          )}
          <Button
            type="button"
            className="w-full h-10 gap-2 bg-[#18181b] text-white hover:bg-[#18181b]/90"
            onClick={onSign}
          >
            <PenLine className="h-4 w-4" />
            Assinar contrato
          </Button>
        </>
      )}
    </div>
  );
}

/**
 * Área de assinaturas no documento (página de assinaturas) — layout da referência.
 */
export function ContractSignature({ data, onRequestSign }: ContractSignatureProps) {
  const norax = data.signatures.find((s) => s.role === "empresa");
  const cliente = data.signatures.find((s) => s.role === "cliente");
  const done = [norax, cliente].filter((s) => s?.status === "assinado").length;
  const pct = Math.round((done / 2) * 100);
  const allDone = done === 2;

  return (
    <div className="mt-2 flex-1 flex flex-col">
      <div className="flex items-start gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-[#18181b] flex items-center justify-center shrink-0 overflow-hidden">
          <NoraxLogo invert className="h-5 w-auto" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[#18181b]">
            Assinaturas do contrato
          </h2>
          <p className="mt-1 text-[12px] text-[#71717a] leading-relaxed max-w-md">
            Acompanhe o status das assinaturas necessárias para a validade deste contrato.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between text-[11px] text-[#71717a] mb-2">
          <span>Progresso</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#f4f4f5] overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] min-w-0">
            <span
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                norax?.status === "assinado"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#e4e4e7] text-[#71717a]"
              )}
            >
              {norax?.status === "assinado" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Building2 className="h-3 w-3" />
              )}
            </span>
            <span className="text-[#52525b] truncate">
              {data.company.legalName || "Norax"} —{" "}
              {norax?.status === "assinado" ? "Assinado" : "Aguardando"}
            </span>
          </div>
          <div className="flex-1 h-px bg-[#e4e4e7] min-w-[12px]" />
          <div className="flex items-center gap-2 text-[11px] min-w-0 justify-end">
            <span
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                cliente?.status === "assinado"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#e4e4e7] text-[#71717a]"
              )}
            >
              {cliente?.status === "assinado" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <PenLine className="h-3 w-3" />
              )}
            </span>
            <span className="text-[#52525b] truncate">
              Cliente —{" "}
              {cliente?.status === "assinado" ? "Assinado" : "Aguardando assinatura"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <PartyCard
          sig={norax}
          role="norax"
          title={data.company.legalName || data.company.name || "Norax Digital Ltda"}
          document={data.company.cnpj}
          onSign={() => onRequestSign?.("norax")}
        />
        <PartyCard
          sig={cliente}
          role="cliente"
          title={data.client.company || data.client.name || "Cliente"}
          document={data.client.cpfCnpj}
          sentLabel={
            data.sentAt && data.sentAt !== "—"
              ? `Convite enviado em ${data.sentAt}`
              : undefined
          }
          onSign={() => onRequestSign?.("cliente")}
        />
      </div>

      {allDone ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-50 px-4 py-3.5 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-medium text-emerald-800">
              Documento totalmente assinado
            </p>
            <p className="text-[11px] text-emerald-700/70 mt-0.5 leading-relaxed">
              Todas as partes concluíram o processo. Validade jurídica ativa.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] px-4 py-3.5 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#71717a] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#52525b] leading-relaxed">
            Este contrato só será considerado válido após a assinatura de todas as partes.
          </p>
        </div>
      )}
    </div>
  );
}

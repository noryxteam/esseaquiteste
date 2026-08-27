"use client";

import type { ClientSetupProfile } from "@/modules/client-setup/types";

interface SignatureBlockProps {
  profile?: ClientSetupProfile | null;
  clientName?: string;
  clientCompany?: string;
  clientDocument?: string;
  noraxName?: string;
  noraxDocument?: string;
}

/**
 * Área de assinaturas fixa — sempre a mesma estrutura em todos os contratos.
 */
export function SignatureBlock({
  profile,
  clientName,
  clientCompany,
  clientDocument,
  noraxName,
  noraxDocument,
}: SignatureBlockProps) {
  const contratante = {
    nome: clientName ?? profile?.personal.nome ?? "—",
    empresa: clientCompany ?? profile?.personal.empresa ?? "—",
    documento: clientDocument ?? profile?.personal.documento ?? "—",
  };
  const contratada = {
    nome: noraxName ?? profile?.norax.razaoSocial ?? "Norax Agency OS",
    documento: noraxDocument ?? profile?.norax.cnpj ?? "—",
  };

  return (
    <section className="mt-10 pt-8 border-t border-[#e4e4e7]">
      <h2 className="text-center text-[11px] font-bold tracking-[0.14em] uppercase text-[#18181b] mb-8">
        Assinaturas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <SignatureParty
          role="CONTRATANTE"
          lines={[
            "Assinatura eletrônica",
            contratante.nome,
            contratante.empresa,
            `CPF/CNPJ: ${contratante.documento}`,
          ]}
        />
        <SignatureParty
          role="CONTRATADA"
          lines={[
            "Assinatura eletrônica",
            "Norax Agency OS",
            contratada.nome,
            `CNPJ: ${contratada.documento}`,
          ]}
        />
      </div>
    </section>
  );
}

function SignatureParty({ role, lines }: { role: string; lines: string[] }) {
  return (
    <div className="text-center space-y-3">
      <p className="text-[10px] font-semibold tracking-wider text-[#71717a]">{role}</p>
      <div className="mx-auto h-16 w-full max-w-[220px] border-b border-[#18181b]/40" />
      <div className="space-y-0.5">
        {lines.map((line, index) => (
          <p key={`${role}-${index}`} className="text-[10px] text-[#3f3f46]">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

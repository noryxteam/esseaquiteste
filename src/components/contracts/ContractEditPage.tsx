"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { electronicContractService } from "@/modules/electronic-contracts";
import { ClauseBlockEditor } from "@/modules/contract-builder/components/ClauseBlockEditor";
import { SignatureBlock } from "@/modules/contract-builder/components/SignatureBlock";
import { paginateClauseBlocks } from "@/modules/contract-builder/pagination";
import type { ClauseBlock } from "@/modules/contract-builder/types";
import { formatBlockNumber, renumberBlocks } from "@/modules/contract-builder/templates";
import { clientSetupService } from "@/modules/client-setup/service";
import { Button } from "@/components/ui/button-shadcn";
import { ArrowLeft } from "lucide-react";
import { getContractAdminPath } from "@/lib/contract-routes";
import type { ContractClause } from "@/modules/electronic-contracts";
import { OpeningContractOverlay } from "@/components/contract-view/OpeningContractOverlay";
import { useAppState } from "@/contexts/app-context";
import { useFeedback } from "@/contexts/feedback-context";

interface ContractEditPageProps {
  contractId: string;
}

function clausesToBlocks(clausulas: ContractClause[]): ClauseBlock[] {
  return clausulas.map((c, i) => ({
    id: c.id || `blk-${i}`,
    titulo: c.titulo,
    paragrafos: c.paragrafos.length ? [...c.paragrafos] : [""],
    ordem: i,
  }));
}

function blocksToClauses(blocks: ClauseBlock[]): ContractClause[] {
  return renumberBlocks(blocks).map((b) => ({
    id: b.id,
    numero: formatBlockNumber(b.ordem),
    titulo: b.titulo,
    paragrafos: b.paragrafos,
  }));
}

export function ContractEditPage({ contractId }: ContractEditPageProps) {
  const router = useRouter();
  const { invalidate } = useAppState();
  const { showInfo } = useFeedback();
  const contract = electronicContractService.getById(contractId);
  const profile = contract ? clientSetupService.get(contract.clienteId) : null;
  const savingRef = useRef(false);

  // Sempre parte do que está salvo — nunca injeta cláusulas padrão.
  const [blocks, setBlocks] = useState<ClauseBlock[]>(() =>
    clausesToBlocks(contract?.clausulas ?? [])
  );
  const [saving, setSaving] = useState(false);

  const pages = useMemo(() => paginateClauseBlocks(blocks), [blocks]);
  const adminPath = getContractAdminPath(contractId);

  useEffect(() => {
    router.prefetch(adminPath);
  }, [router, adminPath]);

  if (!contract) return <p>Contrato não encontrado</p>;
  if (contract.isImmutable) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Este contrato é definitivo e não pode ser editado.</p>
        <Button asChild className="mt-4">
          <Link href={adminPath}>Voltar</Link>
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    if (savingRef.current || saving) return;
    savingRef.current = true;
    setSaving(true);

    try {
      const clausulas = blocksToClauses(blocks);
      electronicContractService.updateContent(
        contractId,
        clausulas,
        contract.editorSettings
      );
      electronicContractService.addFields(contractId, contract.campos);
      invalidate();
      // Overlay fica até a navegação desmontar a página — não desliga no finally
      router.replace(adminPath);
    } catch (e) {
      savingRef.current = false;
      setSaving(false);
      showInfo(e instanceof Error ? e.message : "Não foi possível salvar o contrato.");
    }
  };

  return (
    <div className="space-y-6">
      <OpeningContractOverlay
        open={saving}
        variant="sparkles"
        title="Finalizando contrato"
        description="Você já será direcionado."
      />

      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 gap-1 text-muted-foreground">
          <Link href={adminPath}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <p className="text-[11px] text-muted-foreground mb-1">
          Contratos &gt; {contract.numeroContrato} &gt;{" "}
          <span className="text-foreground">Editar</span>
        </p>
        <h1 className="text-2xl font-semibold">Editor de cláusulas</h1>
        <p className="text-sm text-muted-foreground">
          {contract.numeroContrato} · {pages.length} página(s) estimada(s)
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Adicione o título e a descrição de cada cláusula. Nada vem preenchido automaticamente.
        </p>
      </div>

      <ClauseBlockEditor blocks={blocks} onChange={setBlocks} />

      <div className="rounded-xl border border-border-subtle bg-white text-[#18181b] p-6 sm:p-8">
        <p className="text-[11px] text-muted-foreground mb-4">Prévia das assinaturas (partes)</p>
        <SignatureBlock
          profile={profile}
          clientName={contract.variaveis.cliente}
          clientCompany={contract.variaveis.empresa}
          clientDocument={contract.variaveis.cnpj}
          noraxDocument={profile?.norax.cnpj}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border-subtle">
        <Button variant="outline" asChild disabled={saving}>
          <Link href={adminPath}>Cancelar</Link>
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-foreground text-accent-foreground"
        >
          Salvar e continuar
        </Button>
      </div>
    </div>
  );
}

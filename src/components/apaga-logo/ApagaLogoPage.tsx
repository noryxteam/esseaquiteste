"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileSignature } from "lucide-react";
import { PageTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { ClauseBlockEditor } from "@/modules/contract-builder/components/ClauseBlockEditor";
import { paginateClauseBlocks } from "@/modules/contract-builder/pagination";
import type { ClauseBlock } from "@/modules/contract-builder/types";
import { formatBlockNumber, renumberBlocks } from "@/modules/contract-builder/templates";
import { electronicContractService } from "@/modules/electronic-contracts";
import type { ContractClause } from "@/modules/electronic-contracts";
import { getContractAdminPath } from "@/lib/contract-routes";
import { useAppState } from "@/contexts/app-context";
import { useFeedback } from "@/contexts/feedback-context";
import { OpeningContractOverlay } from "@/components/contract-view/OpeningContractOverlay";
import { PhotoDropField } from "@/components/apaga-logo/PhotoDropField";
import { APAGA_LOGO_FORMA_PAGAMENTO, APAGA_LOGO_FORMA_PAGAMENTO_LINHAS } from "@/lib/apaga-logo";

function blocksToClauses(blocks: ClauseBlock[]): ContractClause[] {
  return renumberBlocks(blocks).map((b) => ({
    id: b.id,
    numero: formatBlockNumber(b.ordem),
    titulo: b.titulo,
    paragrafos: b.paragrafos,
  }));
}

function hasContent(blocks: ClauseBlock[]): boolean {
  return blocks.some(
    (b) => b.titulo.trim() || b.paragrafos.some((p) => p.trim())
  );
}

export function ApagaLogoPage() {
  const router = useRouter();
  const { invalidate } = useAppState();
  const { showInfo } = useFeedback();

  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cliente, setCliente] = useState("");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");
  const [fotoContratado, setFotoContratado] = useState("");
  const [fotoCliente, setFotoCliente] = useState("");
  const [blocks, setBlocks] = useState<ClauseBlock[]>([
    { id: "blk-1", titulo: "", paragrafos: [""], ordem: 0 },
  ]);
  const [creating, setCreating] = useState(false);

  const pages = useMemo(() => paginateClauseBlocks(blocks), [blocks]);

  const handleCreate = () => {
    if (!hasContent(blocks)) {
      showInfo("Adicione pelo menos uma cláusula com título ou texto.");
      return;
    }

    setCreating(true);
    try {
      const clausulas = blocksToClauses(blocks);
      const contract = electronicContractService.createWithClauses({
        titulo: titulo.trim() || "Contrato avulso",
        clausulas,
        empresa: empresa.trim(),
        cliente: cliente.trim(),
        valor: Number(valor) || 0,
        formaPagamento: APAGA_LOGO_FORMA_PAGAMENTO,
        prazo: prazo || undefined,
        fotoContratado: fotoContratado || undefined,
        fotoCliente: fotoCliente || undefined,
      });

      void import("@/modules/electronic-contracts/sync-api").then(
        ({ syncElectronicContractInBackground }) => {
          syncElectronicContractInBackground(contract);
        }
      );

      invalidate();
      router.push(getContractAdminPath(contract.id));
    } catch (e) {
      setCreating(false);
      showInfo(e instanceof Error ? e.message : "Não foi possível criar o contrato.");
    }
  };

  return (
    <div className="space-y-6">
      <OpeningContractOverlay
        open={creating}
        variant="sparkles"
        title="Criando contrato"
        description="Você já será direcionado."
      />

      <PageTitle
        title="Apaga Logo"
        description="Monte o contrato direto aqui — sem cadastrar cliente ou projeto. Adicione as cláusulas e gere o documento."
      />

      <div className="rounded-xl border border-border-subtle bg-surface/40 p-5 space-y-4 max-w-3xl">
        <div>
          <label className="text-xs text-muted-foreground">Título do contrato (opcional)</label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 h-10"
            placeholder="Ex.: Contrato de prestação de serviços"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Seu nome (contratado)</label>
            <Input
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="mt-1 h-10"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Nome do cliente</label>
            <Input
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="mt-1 h-10"
              placeholder="Nome do cliente"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Valor total (R$)</label>
            <Input
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              type="number"
              className="mt-1 h-10"
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Forma de pagamento</label>
            <div className="mt-1 min-h-10 rounded-lg border border-border bg-surface-inset px-3 py-1.5 flex items-center text-sm text-foreground whitespace-pre-line leading-tight">
              {APAGA_LOGO_FORMA_PAGAMENTO_LINHAS}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Data do prazo</label>
            <Input
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              type="date"
              className="mt-1 h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PhotoDropField
            label="Sua foto"
            value={fotoContratado}
            onChange={setFotoContratado}
          />
          <PhotoDropField
            label="Foto do cliente"
            value={fotoCliente}
            onChange={setFotoCliente}
          />
        </div>

        <p className="text-[11px] text-muted-foreground">
          {pages.length} página(s) estimada(s) · aparece também em Contratos após salvar
        </p>
      </div>

      <ClauseBlockEditor blocks={blocks} onChange={setBlocks} />

      <div className="flex justify-end pt-4 border-t border-border-subtle">
        <Button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="h-11 gap-2 bg-foreground text-accent-foreground px-6"
        >
          <FileSignature className="h-4 w-4" />
          Criar contrato
        </Button>
      </div>
    </div>
  );
}

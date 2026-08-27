import { apiFetch } from "@/modules/auth/api/auth.api";
import { getSeedData } from "@/mock/seed";
import { getClienteById } from "@/lib/mock-data/clientes";
import { getClientSetup } from "@/modules/client-setup/store";
import type { ElectronicContract } from "@/mock/electronic-contracts/types";

const STATUS_MAP: Record<ElectronicContract["status"], string> = {
  rascunho: "RASCUNHO",
  "em-revisao": "EM_REVISAO",
  definitivo: "DEFINITIVO",
  "aguardando-assinatura": "AGUARDANDO_ASSINATURA",
  "parcialmente-assinado": "PARCIALMENTE_ASSINADO",
  assinado: "ASSINADO",
  finalizado: "FINALIZADO",
  arquivado: "ARQUIVADO",
  cancelado: "CANCELADO",
  expirado: "EXPIRADO",
};

const LIFECYCLE_MAP: Record<ElectronicContract["lifecycleStep"], string> = {
  criado: "CRIADO",
  editado: "EDITADO",
  campos_adicionados: "CAMPOS_ADICIONADOS",
  revisado: "REVISADO",
  definitivo: "DEFINITIVO",
  enviado: "ENVIADO",
  cliente_acessou: "CLIENTE_ACESSOU",
  dispositivo_autorizado: "DISPOSITIVO_AUTORIZADO",
  cliente_leu: "CLIENTE_LEU",
  aceite_eletronico: "ACEITE_ELETRONICO",
  cliente_assinou: "CLIENTE_ASSINOU",
  norax_assinou: "NORAX_ASSINOU",
  pdf_gerado: "PDF_GERADO",
  arquivado: "ARQUIVADO",
};

function buildClientSnapshot(contract: ElectronicContract) {
  const seed = getSeedData();
  const mock = seed.clients.find((c) => c.id === contract.clienteId);
  const row = getClienteById(contract.clienteId);
  const setup = getClientSetup(contract.clienteId);
  const personal = setup?.personal;

  const nome =
    personal?.nome || mock?.nome || row?.contactName || contract.variaveis.cliente || "Cliente";
  const empresa =
    personal?.empresa || mock?.empresa || row?.name || contract.variaveis.empresa || nome;
  const email =
    personal?.email || mock?.email || (row?.email !== "—" ? row?.email : "") || contract.variaveis.email || "";
  const emailNotificacao = setup?.service?.emailRecuperacao?.trim() || null;

  return {
    id: contract.clienteId,
    nome,
    empresa,
    email: email || `${contract.clienteId}@norax.local`,
    emailNotificacao,
    telefone: personal?.telefone || mock?.telefone || contract.variaveis.telefone || null,
    segmento: mock?.segmento || "Geral",
    cidade: personal?.cidade || mock?.cidade || "São Paulo",
    estado: (personal?.estado || mock?.estado || "SP").slice(0, 2),
  };
}

function buildProjectSnapshot(contract: ElectronicContract) {
  const seed = getSeedData();
  const project = seed.projects.find((p) => p.id === contract.projetoId);

  return {
    id: contract.projetoId,
    clienteId: contract.clienteId,
    nome: project?.nome || contract.variaveis.projeto || contract.titulo,
    descricao: project?.descricao || null,
    valor: project?.valor ?? contract.valor,
    dataInicio: project?.dataInicio || contract.dataCriacao,
    prazo: project?.prazo || contract.prazo,
  };
}

/** Sincroniza o contrato eletrônico com o banco (fonte da verdade das URLs públicas). */
export async function syncElectronicContractToBackend(
  contract: ElectronicContract
): Promise<{ id: string; uniqueSlug: string; numeroContrato: string }> {
  const res = await apiFetch<{ id: string; uniqueSlug: string; numeroContrato: string }>(
    "/contracts/sync",
    {
      method: "PUT",
      body: JSON.stringify({
        id: contract.id,
        clienteId: contract.clienteId,
        projetoId: contract.projetoId,
        numeroContrato: contract.numeroContrato,
        uniqueSlug: contract.uniqueSlug,
        titulo: contract.titulo,
        valor: contract.valor,
        status: STATUS_MAP[contract.status] ?? "RASCUNHO",
        lifecycleStep: LIFECYCLE_MAP[contract.lifecycleStep] ?? "CRIADO",
        versao: contract.versao,
        isImmutable: contract.isImmutable,
        formaPagamento: contract.formaPagamento || "PIX",
        parcelas: contract.parcelas || 1,
        prazo: contract.prazo,
        responsavelId: contract.responsavelId || null,
        link: contract.shareLink || null,
        hashDocumento: contract.hashDocumento || null,
        accessCode: contract.accessCode,
        dataEnvio: contract.dataEnvio,
        dataAssinatura: contract.dataAssinatura,
        clauseBlocks: contract.clausulas.map((cl, ordem) => ({
          id: cl.id,
          titulo: cl.titulo,
          paragrafos: cl.paragrafos,
          ordem,
        })),
        campos: contract.campos,
        editorSettings: contract.editorSettings,
        conteudo: {
          variaveis: contract.variaveis,
          assinaturas: contract.assinaturas,
          timeline: contract.timeline,
        },
        client: buildClientSnapshot(contract),
        project: buildProjectSnapshot(contract),
      }),
    },
    15_000
  );

  return res.data;
}

/**
 * Garante que o contrato existe no banco antes de abrir a URL pública.
 * Falha de forma explícita — nunca engole erro.
 */
export async function ensureContractSyncedInBackend(
  contract: ElectronicContract
): Promise<{ id: string; uniqueSlug: string; numeroContrato: string }> {
  return syncElectronicContractToBackend(contract);
}

export function syncElectronicContractInBackground(contract: ElectronicContract): void {
  void syncElectronicContractToBackend(contract).catch((err) => {
    console.error("[norax] Falha ao sincronizar contrato com o banco:", err);
  });
}

/** Empurra todos os contratos locais para o banco (migração / recuperação). */
export function syncAllElectronicContractsInBackground(): void {
  const started = performance.now();
  void import("@/mock/electronic-contracts/store").then(({ getAllElectronicContracts }) => {
    const all = getAllElectronicContracts();
    console.info(
      `[perf] syncAllContracts count=${all.length} load=${Math.round(performance.now() - started)}ms`
    );
    for (const contract of all) {
      syncElectronicContractInBackground(contract);
    }
  });
}

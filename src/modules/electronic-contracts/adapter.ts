import type { ContractDocumentData, ContractPageContent } from "@/lib/mock-data/contract-document-types";
import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import type { ElectronicContract } from "@/mock/electronic-contracts/types";
import { getSeedData } from "@/mock/seed";
import { getClientSetup } from "@/modules/client-setup/store";
import { APAGA_LOGO_FORMA_PAGAMENTO_LINHAS } from "@/lib/apaga-logo";
import { paginateClauseBlocks } from "@/modules/contract-builder/pagination";
import {
  COVER_OVERHEAD_UNITS,
  PAGE_CONTENT_UNITS,
  type ClauseBlock,
} from "@/modules/contract-builder/types";

function statusVariant(
  status: ElectronicContract["status"]
): ContractViewData["statusVariant"] {
  if (status === "aguardando-assinatura" || status === "parcialmente-assinado")
    return "aguardando-assinatura";
  if (status === "assinado" || status === "finalizado" || status === "arquivado")
    return "assinado";
  if (status === "definitivo" || status === "em-revisao") return "rascunho";
  return "rascunho";
}

function clausesToBlocks(clausulas: ElectronicContract["clausulas"]): ClauseBlock[] {
  return clausulas.map((cl, i) => ({
    id: cl.id || `cl-${i}`,
    titulo: cl.titulo,
    paragrafos: cl.paragrafos,
    ordem: i,
  }));
}

/** Empacota o máximo de cláusulas por página — nunca corta uma cláusula. */
function buildPagedContent(clausulas: ElectronicContract["clausulas"]): ContractPageContent[] {
  const blocks = clausesToBlocks(clausulas);
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const layouts = paginateClauseBlocks(blocks, {
    firstPageUnits: PAGE_CONTENT_UNITS - COVER_OVERHEAD_UNITS,
    pageUnits: PAGE_CONTENT_UNITS,
  });

  return layouts.map((layout, index) => {
    const sections = layout.blockIds
      .map((id) => byId.get(id))
      .filter((b): b is ClauseBlock => Boolean(b))
      .map((b) => ({
        number: String(b.ordem + 1).padStart(2, "0"),
        title: b.titulo || "CLÁUSULA",
        paragraphs: b.paragrafos.filter((p) => p.trim()).length ? b.paragrafos : [""],
      }));

    if (index === 0) {
      return {
        id: 1,
        type: "cover" as const,
        title: "Capa",
        sections,
      };
    }

    return {
      id: index + 1,
      type: "content" as const,
      sections,
    };
  });
}

export function toContractDocumentData(contract: ElectronicContract): ContractDocumentData {
  const seed = getSeedData();
  const setup = getClientSetup(contract.clienteId);
  const client = seed.clients.find((c) => c.id === contract.clienteId);
  const project = seed.projects.find((p) => p.id === contract.projetoId);

  const contentPages = buildPagedContent(contract.clausulas);
  const lastContentId = contentPages[contentPages.length - 1]?.id ?? 1;

  const pages: ContractPageContent[] = [
    ...(contentPages.length > 0
      ? contentPages
      : [{ id: 1, type: "cover" as const, title: "Capa", sections: [] }]),
    { id: lastContentId + 1, type: "signatures" as const, title: "Assinaturas" },
  ];

  const clientSig = contract.assinaturas.find((s) => s.role === "cliente");
  const noraxSig = contract.assinaturas.find((s) => s.role === "norax");

  const isApagaLogo =
    contract.editorSettings?.origem === "apaga-logo" || contract.clienteId === "standalone";
  const contratadoNome = contract.variaveis.empresa.trim();

  const base: ContractViewData = {
    id: contract.id,
    number: contract.numeroContrato,
    title: contract.titulo,
    subtitle: project?.nome ?? "",
    status: contract.status,
    statusLabel:
      contract.status === "parcialmente-assinado"
        ? "Parcialmente assinado"
        : contract.status.replace(/-/g, " "),
    statusVariant: statusVariant(contract.status),
    company: {
      name: isApagaLogo ? contratadoNome || "Contratado" : "Norax",
      legalName: isApagaLogo ? contratadoNome : "Norax Digital Ltda",
      cnpj: isApagaLogo ? "" : "12.345.678/0001-90",
      address: "Av. Paulista, 1000",
      city: "São Paulo — SP",
      email: "contato@norax.dev",
      phone: "(11) 3000-0000",
      representative: isApagaLogo ? contratadoNome || contract.responsavelNome : contract.responsavelNome,
    },
    client: {
      name: setup?.personal.nome || client?.nome || contract.variaveis.cliente || "",
      company: setup?.personal.empresa || client?.empresa || (isApagaLogo ? "" : contract.variaveis.empresa) || "",
      cpfCnpj: setup?.personal.documento || contract.variaveis.cnpj || "",
      address: setup?.personal.endereco || `${client?.cidade ?? ""}`,
      city: setup
        ? `${setup.personal.cidade} — ${setup.personal.estado}`
        : `${client?.cidade ?? ""} — ${client?.estado ?? ""}`,
      email: setup?.personal.email || client?.email || contract.variaveis.email || "",
      phone: setup?.personal.telefone || client?.telefone || contract.variaveis.telefone || "",
      representative: setup?.personal.nome || client?.nome || contract.variaveis.cliente || "",
    },
    value: contract.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    valueRaw: contract.valor,
    paymentMethod: isApagaLogo ? APAGA_LOGO_FORMA_PAGAMENTO_LINHAS : contract.formaPagamento,
    installments: `${contract.parcelas}x`,
    deadline: contract.prazo,
    template: "Prestação de Serviços",
    createdAt: contract.dataCriacao,
    createdTime: "09:00",
    sentAt: contract.dataEnvio ?? "—",
    sentTime: "10:00",
    contractDate: contract.dataCriacao,
    link: contract.shareLink,
    signaturesCount: contract.assinaturas.length,
    signaturesTotal: 2,
    uniqueCode: contract.numeroContrato,
    uniqueSlug: contract.uniqueSlug,
    accessCode: contract.accessCode,
    hash: contract.hashDocumento,
    hashShort: contract.hashDocumento.slice(0, 8) + "...",
    issuedAt: contract.dataCriacao,
    lastValidation: contract.dataAssinatura ?? "—",
    protected: contract.isImmutable,
    signatures: [
      {
        role: "empresa",
        roleLabel: "Norax",
        name: noraxSig?.nome ?? contract.responsavelNome,
        document: noraxSig?.documento ?? "12.345.678/0001-90",
        date: noraxSig?.data,
        time: noraxSig?.hora,
        status: noraxSig ? "assinado" : "pendente",
      },
      {
        role: "cliente",
        roleLabel: "Cliente",
        name: clientSig?.nome ?? client?.nome ?? "",
        document: clientSig?.documento ?? "00.000.000/0001-00",
        date: clientSig?.data,
        time: clientSig?.hora,
        status: clientSig ? "assinado" : "pendente",
      },
    ],
    timeline: contract.timeline.map((t) => ({
      id: t.id,
      title: t.titulo,
      description: t.descricao,
      date: t.data,
      time: t.hora,
      completed: true,
    })),
    metadata: {
      internalId: contract.id,
      version: `v${contract.versao}`,
      views: contract.securityLogs.length,
      authorizedDevices: contract.dispositivosAutorizados.length,
      lastAccess: contract.dispositivosAutorizados[0]?.ultimoAcesso ?? "—",
      ip: "—",
    },
    isApagaLogo,
    partyPhotos: isApagaLogo
      ? {
          contratado: contract.editorSettings.fotoContratado,
          cliente: contract.editorSettings.fotoCliente,
        }
      : undefined,
  };

  return {
    ...base,
    totalPages: pages.length,
    pages,
    accessCode: contract.accessCode?.replace("NXR-", "") ?? "",
    shareLink: contract.shareLink,
    qrValue: contract.uniqueSlug,
    history: contract.timeline.map((t) => ({
      id: t.id,
      title: t.titulo,
      date: t.data,
      time: t.hora,
      responsible: t.usuario,
    })),
  };
}

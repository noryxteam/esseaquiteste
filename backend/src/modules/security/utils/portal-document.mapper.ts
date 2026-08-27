import type { Contract, Client, Project, ContractSignatureRecord, ContractStatus } from "@prisma/client";

type ContractWithRelations = Contract & {
  cliente: Pick<Client, "id" | "nome" | "empresa" | "email"> &
    Partial<Pick<Client, "telefone" | "cidade" | "estado">> & {
      setupData?: unknown;
    };
  projeto: Pick<Project, "id" | "nome">;
  signatures?: ContractSignatureRecord[];
};

interface ClauseBlock {
  id: string;
  titulo: string;
  paragrafos: string[];
  ordem: number;
}

interface PortalSection {
  number: string;
  title: string;
  paragraphs: string[];
}

interface PortalPage {
  id: number;
  type: "cover" | "content" | "signatures";
  title?: string;
  sections?: PortalSection[];
}

const STATUS_LABEL: Record<ContractStatus, string> = {
  RASCUNHO: "Rascunho",
  EM_REVISAO: "Em revisão",
  DEFINITIVO: "Definitivo",
  AGUARDANDO_ASSINATURA: "Aguardando assinatura",
  PARCIALMENTE_ASSINADO: "Parcialmente assinado",
  ASSINADO: "Assinado",
  FINALIZADO: "Finalizado",
  ARQUIVADO: "Arquivado",
  CANCELADO: "Cancelado",
  EXPIRADO: "Expirado",
};

const STATUS_VARIANT: Record<
  ContractStatus,
  "aguardando-assinatura" | "assinado" | "finalizado" | "rascunho"
> = {
  RASCUNHO: "rascunho",
  EM_REVISAO: "rascunho",
  DEFINITIVO: "rascunho",
  AGUARDANDO_ASSINATURA: "aguardando-assinatura",
  PARCIALMENTE_ASSINADO: "aguardando-assinatura",
  ASSINADO: "assinado",
  FINALIZADO: "finalizado",
  ARQUIVADO: "finalizado",
  CANCELADO: "rascunho",
  EXPIRADO: "rascunho",
};

function formatDateBR(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function formatTimeBR(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseClauseBlocks(raw: unknown): ClauseBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const block = item as Record<string, unknown>;
      const paragrafos = Array.isArray(block.paragrafos)
        ? block.paragrafos.filter((p): p is string => typeof p === "string")
        : [];
      return {
        id: typeof block.id === "string" ? block.id : `cl-${index}`,
        titulo: typeof block.titulo === "string" ? block.titulo : "CLÁUSULA",
        paragrafos: paragrafos.length > 0 ? paragrafos : [""],
        ordem: typeof block.ordem === "number" ? block.ordem : index,
      };
    })
    .filter((b): b is ClauseBlock => Boolean(b))
    .sort((a, b) => a.ordem - b.ordem);
}

function buildPages(blocks: ClauseBlock[]): PortalPage[] {
  const perPage = 4;
  const chunks: ClauseBlock[][] = [];
  for (let i = 0; i < blocks.length; i += perPage) {
    chunks.push(blocks.slice(i, i + perPage));
  }

  if (chunks.length === 0) {
    chunks.push([]);
  }

  const contentPages: PortalPage[] = chunks.map((chunk, index) => ({
    id: index + 1,
    type: index === 0 ? ("cover" as const) : ("content" as const),
    title: index === 0 ? "Capa" : undefined,
    sections: chunk.map((b, i) => ({
      number: String(b.ordem + 1 || i + 1).padStart(2, "0"),
      title: b.titulo,
      paragraphs: b.paragrafos,
    })),
  }));

  const lastId = contentPages[contentPages.length - 1]?.id ?? 1;
  return [...contentPages, { id: lastId + 1, type: "signatures", title: "Assinaturas" }];
}

export function mapContractToPortalMeta(contract: ContractWithRelations) {
  return {
    id: contract.id,
    slug: contract.uniqueSlug,
    number: contract.numeroContrato,
    title: contract.titulo,
    status: contract.status,
    clientName: contract.cliente.nome,
    companyName: contract.cliente.empresa,
  };
}

function extractClientDocument(contract: ContractWithRelations): string {
  const setup = contract.cliente.setupData;
  if (setup && typeof setup === "object") {
    const personal = (setup as { personal?: { documento?: string } }).personal;
    if (personal?.documento?.trim()) return personal.documento.trim();
  }
  const conteudo = contract.conteudo;
  if (conteudo && typeof conteudo === "object") {
    const vars = (conteudo as { variaveis?: Record<string, string> }).variaveis;
    const doc = vars?.cnpj || vars?.cpf || vars?.documento;
    if (doc && doc.trim() && doc !== "—" && doc !== "00.000.000/0001-00") return doc.trim();
  }
  return "";
}

export function mapContractToPortalDocument(contract: ContractWithRelations) {
  const blocks = parseClauseBlocks(contract.clauseBlocks);
  const pages = buildPages(blocks);
  const valor = Number(contract.valor);
  const hash = contract.hashDocumento ?? "";
  const signatures = contract.signatures ?? [];
  const clientSig = signatures.find((s) => /cliente/i.test(s.role));
  const noraxSig = signatures.find((s) => /norax|empresa/i.test(s.role));
  const clientDoc = clientSig?.documento || extractClientDocument(contract);

  return {
    id: contract.id,
    number: contract.numeroContrato,
    title: contract.titulo,
    subtitle: contract.projeto.nome,
    status: contract.status.toLowerCase().replace(/_/g, "-"),
    statusLabel: STATUS_LABEL[contract.status],
    statusVariant: STATUS_VARIANT[contract.status],
    company: {
      name: "Norax",
      legalName: "Norax Digital Ltda",
      cnpj: "12.345.678/0001-90",
      address: "Av. Paulista, 1000",
      city: "São Paulo — SP",
      email: "contato@norax.dev",
      phone: "(11) 3000-0000",
      representative: "Norax",
    },
    client: {
      name: contract.cliente.nome,
      company: contract.cliente.empresa,
      cpfCnpj: clientDoc,
      address: "",
      city: [contract.cliente.cidade, contract.cliente.estado].filter(Boolean).join(" — "),
      email: contract.cliente.email,
      phone: contract.cliente.telefone ?? "",
      representative: contract.cliente.nome,
    },
    value: valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    valueRaw: valor,
    paymentMethod: contract.formaPagamento,
    installments: `${contract.parcelas}x`,
    deadline: contract.prazo ? formatDateBR(contract.prazo) : "—",
    template: "Prestação de Serviços",
    createdAt: formatDateBR(contract.dataCriacao),
    createdTime: formatTimeBR(contract.dataCriacao),
    sentAt: formatDateBR(contract.dataEnvio),
    sentTime: formatTimeBR(contract.dataEnvio),
    contractDate: formatDateBR(contract.dataCriacao),
    link: contract.link ?? `https://contratos.norax.com/${contract.uniqueSlug}`,
    signaturesCount: signatures.length,
    signaturesTotal: 2,
    uniqueCode: contract.numeroContrato,
    uniqueSlug: contract.uniqueSlug,
    hash,
    hashShort: hash ? `${hash.slice(0, 8)}...` : "—",
    issuedAt: formatDateBR(contract.dataCriacao),
    lastValidation: formatDateBR(contract.dataAssinatura),
    protected: contract.isImmutable,
    signatures: [
      {
        role: "empresa" as const,
        roleLabel: "Norax",
        name: noraxSig?.nome ?? "Norax",
        document: noraxSig?.documento ?? "12.345.678/0001-90",
        date: noraxSig ? formatDateBR(noraxSig.dataAssinatura) : undefined,
        time: noraxSig ? formatTimeBR(noraxSig.dataAssinatura) : undefined,
        status: noraxSig ? ("assinado" as const) : ("pendente" as const),
      },
      {
        role: "cliente" as const,
        roleLabel: "Cliente",
        name: clientSig?.nome ?? contract.cliente.nome,
        document: clientDoc || "—",
        date: clientSig ? formatDateBR(clientSig.dataAssinatura) : undefined,
        time: clientSig ? formatTimeBR(clientSig.dataAssinatura) : undefined,
        status: clientSig ? ("assinado" as const) : ("pendente" as const),
      },
    ],
    timeline: [],
    metadata: {
      internalId: contract.id,
      version: `v${contract.versao}`,
      views: 0,
      authorizedDevices: 0,
      lastAccess: "—",
      ip: "—",
    },
    totalPages: pages.length,
    pages,
    accessCode: "",
    shareLink: contract.link ?? `https://contratos.norax.com/${contract.uniqueSlug}`,
    qrValue: contract.uniqueSlug,
    history: [],
  };
}

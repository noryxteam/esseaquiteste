import { getSeedData } from "@/mock/seed";
import { isoDate } from "@/mock/common/utils";
import type {
  ContractClause,
  ContractLifecycleStep,
  ContractTimelineEntry,
  ElectronicContract,
  ElectronicContractStatus,
} from "@/mock/electronic-contracts/types";
import {
  generateAccessCode,
  generateDocumentHash,
  generateUniqueSlug,
  getShareLink,
  nowBR,
} from "@/mock/electronic-contracts/utils";
import { LIFECYCLE_LABELS } from "@/mock/electronic-contracts/lifecycle";

const DEFAULT_CLAUSES: ContractClause[] = [
  {
    id: "cl-1",
    numero: "01",
    titulo: "OBJETO DO CONTRATO",
    paragrafos: [
      "O presente contrato tem por objeto a prestação de serviços de {{projeto}}, conforme escopo acordado entre {{empresa}} e {{cliente}}.",
      "O escopo compreende planejamento, execução, testes e entrega dos entregáveis definidos entre as partes.",
    ],
  },
  {
    id: "cl-2",
    numero: "02",
    titulo: "VALORES E PAGAMENTO",
    paragrafos: [
      "Pela execução dos serviços, a CONTRATANTE pagará à CONTRATADA o valor total de {{valor}}, conforme condições de pagamento acordadas.",
    ],
  },
  {
    id: "cl-3",
    numero: "03",
    titulo: "PRAZO",
    paragrafos: [
      "O prazo para execução será conforme cronograma aprovado, contado a partir da assinatura deste instrumento.",
    ],
  },
  {
    id: "cl-4",
    numero: "04",
    titulo: "FORO",
    paragrafos: [
      "Fica eleito o foro da comarca de São Paulo — SP para dirimir controvérsias oriundas deste contrato.",
    ],
  },
];

function mapStatusToLifecycle(
  status: string,
  assinado: boolean
): { status: ElectronicContractStatus; step: ContractLifecycleStep } {
  if (status === "rascunho") return { status: "rascunho", step: "criado" };
  if (status === "aguardando-assinatura")
    return { status: "aguardando-assinatura", step: "enviado" };
  if (status === "assinado" && assinado)
    return { status: "assinado", step: "norax_assinou" };
  if (status === "finalizado")
    return { status: "arquivado", step: "arquivado" };
  if (status === "cancelado") return { status: "cancelado", step: "criado" };
  if (status === "expirado") return { status: "expirado", step: "enviado" };
  return { status: "rascunho", step: "criado" };
}

function buildTimelineFromStep(step: ContractLifecycleStep): ContractTimelineEntry[] {
  const order: ContractLifecycleStep[] = [
    "criado",
    "editado",
    "campos_adicionados",
    "revisado",
    "definitivo",
    "enviado",
    "cliente_acessou",
    "dispositivo_autorizado",
    "cliente_leu",
    "aceite_eletronico",
    "cliente_assinou",
    "norax_assinou",
    "pdf_gerado",
    "arquivado",
  ];
  const idx = order.indexOf(step);
  const { date, time } = nowBR();
  return order.slice(0, idx + 1).map((s, i) => ({
    id: `tl-${s}`,
    step: s,
    titulo: LIFECYCLE_LABELS[s],
    descricao: LIFECYCLE_LABELS[s],
    data: date,
    hora: time,
    usuario: i < 5 ? "Sistema Norax" : "Cliente",
  }));
}

function bootstrapElectronicContracts(): Map<string, ElectronicContract> {
  const seed = getSeedData();
  const map = new Map<string, ElectronicContract>();
  const slugs = new Set<string>();

  for (const c of seed.contracts) {
    const client = seed.clients.find((cl) => cl.id === c.clienteId);
    const project = seed.projects.find((p) => p.id === c.projetoId);
    const responsavel = seed.users.find((u) => u.id === project?.responsavelId) ?? seed.users[0];
    const { status, step } = mapStatusToLifecycle(c.status, c.assinado);
    const slug = c.id;
    slugs.add(slug);
    const isSent = stepIndex(step) >= stepIndex("enviado");

    const ec: ElectronicContract = {
      id: c.id,
      numeroContrato: c.numeroContrato,
      clienteId: c.clienteId,
      projetoId: c.projetoId,
      titulo: `Contrato — ${project?.nome ?? "Projeto"}`,
      valor: c.valor,
      formaPagamento: c.formaPagamento,
      parcelas: c.parcelas,
      prazo: project?.prazo ?? isoDate(2024, 8, 1),
      responsavelId: responsavel.id,
      responsavelNome: responsavel.nome,
      status,
      lifecycleStep: step,
      versao: isSent ? 1 : 0,
      isImmutable: isSent,
      uniqueSlug: slug,
      accessCode: isSent ? generateAccessCode() : null,
      accessCodeUsed: stepIndex(step) > stepIndex("dispositivo_autorizado"),
      shareLink: getShareLink(slug),
      hashDocumento: c.hashDocumento,
      dataCriacao: c.dataCriacao,
      dataEnvio: isSent ? c.dataCriacao : null,
      dataAssinatura: c.dataAssinatura,
      clausulas: DEFAULT_CLAUSES.map((cl) => ({ ...cl, id: `${c.id}-${cl.id}` })),
      campos: [],
      variaveis: {
        cliente: client?.nome ?? "",
        empresa: client?.empresa ?? "",
        cpf: client?.nome ?? "",
        cnpj: "00.000.000/0001-00",
        valor: c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
        data: new Date().toLocaleDateString("pt-BR"),
        projeto: project?.nome ?? "",
        endereco: `${client?.cidade ?? ""}, ${client?.estado ?? ""}`,
        telefone: client?.telefone ?? "",
        email: client?.email ?? "",
      },
      editorSettings: {
        cabecalho: "Norax Digital Ltda — Contrato de Prestação de Serviços",
        rodape: "Documento gerado eletronicamente pela plataforma Norax Agency OS",
      },
      assinaturas: [],
      dispositivosAutorizados: [],
      solicitacoesDispositivo: [],
      timeline: buildTimelineFromStep(step),
      securityLogs: [],
      pdfUrl: status === "arquivado" || status === "assinado" ? `/mock-pdf/${c.id}.pdf` : null,
      conteudoResolvido: isSent,
    };

    if (c.assinado) {
      ec.assinaturas = [
        {
          role: "cliente",
          nome: client?.nome ?? "",
          documento: "00.000.000/0001-00",
          data: c.dataAssinatura ?? "",
          hora: "14:30",
          aceiteEletronico: true,
          assinadoEm: c.dataAssinatura ?? "",
        },
        {
          role: "norax",
          nome: responsavel.nome,
          documento: "12.345.678/0001-90",
          data: c.dataAssinatura ?? "",
          hora: "15:00",
          aceiteEletronico: true,
          assinadoEm: c.dataAssinatura ?? "",
        },
      ];
    }

    map.set(c.id, ec);
    map.set(slug, ec);
  }

  return map;
}

function stepIndex(step: ContractLifecycleStep): number {
  const order: ContractLifecycleStep[] = [
    "criado",
    "editado",
    "campos_adicionados",
    "revisado",
    "definitivo",
    "enviado",
    "cliente_acessou",
    "dispositivo_autorizado",
    "cliente_leu",
    "aceite_eletronico",
    "cliente_assinou",
    "norax_assinou",
    "pdf_gerado",
    "arquivado",
  ];
  return order.indexOf(step);
}

const STORAGE_KEY = "norax.electronic-contracts.v1";

let store: Map<string, ElectronicContract> | null = null;

function readPersistedContracts(): ElectronicContract[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ElectronicContract[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePersistedContracts(contracts: ElectronicContract[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  } catch {
    // quota / private mode
  }
}

function indexContract(map: Map<string, ElectronicContract>, contract: ElectronicContract): void {
  map.set(contract.id, contract);
  map.set(contract.uniqueSlug, contract);
}

export function getElectronicContractStore(): Map<string, ElectronicContract> {
  if (!store) {
    store = new Map();
    for (const contract of readPersistedContracts()) {
      indexContract(store, contract);
    }
  }
  return store;
}

export function resetElectronicContractStore(): void {
  store = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getElectronicContract(idOrSlug: string): ElectronicContract | undefined {
  return getElectronicContractStore().get(idOrSlug);
}

export function getAllElectronicContracts(): ElectronicContract[] {
  const seen = new Set<string>();
  const list: ElectronicContract[] = [];
  for (const c of getElectronicContractStore().values()) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    list.push(c);
  }
  return list.sort((a, b) => (a.dataCriacao < b.dataCriacao ? 1 : -1));
}

export function persistElectronicContract(contract: ElectronicContract): void {
  const map = getElectronicContractStore();
  indexContract(map, contract);
  writePersistedContracts(getAllElectronicContracts());
}

export function deleteElectronicContractsByClienteId(clienteId: string): number {
  const all = getAllElectronicContracts();
  const remaining = all.filter((c) => c.clienteId !== clienteId);
  const removed = all.length - remaining.length;
  store = new Map();
  for (const contract of remaining) {
    indexContract(store, contract);
  }
  writePersistedContracts(remaining);
  return removed;
}

export function createElectronicContractId(): string {
  const existing = getAllElectronicContracts();
  const num = existing.length + 1;
  return `ctr-${String(num).padStart(4, "0")}`;
}

export function createContractNumber(): string {
  const year = new Date().getFullYear();
  const num = getAllElectronicContracts().length + 1;
  return `NX-${year}${String(num).padStart(4, "0")}`;
}

export { generateAccessCode, generateDocumentHash, generateUniqueSlug, getShareLink, nowBR };

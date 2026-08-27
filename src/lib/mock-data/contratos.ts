import type { ContratosData } from "@/lib/mock-data/contratos-types";
import type { Contract, ContractStatus } from "@/lib/mock-data/contratos-types";
import type { ElectronicContract } from "@/mock/electronic-contracts/types";
import { getAllElectronicContracts } from "@/mock/electronic-contracts/store";
import { getClientSetup } from "@/modules/client-setup/store";

export const contratosData: ContratosData = {
  stats: [
    { id: "total", title: "Total de contratos", value: "0", icon: "FileText", subtitle: "R$ 0,00" },
    { id: "signed", title: "Assinados", value: "0", icon: "CheckCircle2", subtitle: "0%" },
    { id: "pending", title: "Aguardando", value: "0", icon: "Clock", subtitleDirection: "neutral" },
    { id: "value", title: "Valor total", value: "R$ 0,00", icon: "Wallet" },
  ],
  contracts: [],
  templates: [
    { id: "tpl-1", name: "Prestação de Serviços", description: "Contrato padrão de serviços digitais", icon: "FileText" },
    { id: "tpl-2", name: "Manutenção Mensal", description: "Contrato recorrente de suporte", icon: "RefreshCw" },
    { id: "tpl-3", name: "Projeto Fechado", description: "Escopo fixo com entregáveis", icon: "Package" },
  ],
};

const STATUS_LABELS: Record<string, string> = {
  rascunho: "Rascunho",
  "em-revisao": "Em revisão",
  definitivo: "Definitivo",
  "aguardando-assinatura": "Aguardando assinatura",
  "parcialmente-assinado": "Parcialmente assinado",
  assinado: "Assinado",
  finalizado: "Finalizado",
  arquivado: "Arquivado",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

function mapElectronicStatus(status: ElectronicContract["status"]): ContractStatus {
  if (status === "em-revisao" || status === "definitivo") return "rascunho";
  if (status === "parcialmente-assinado") return "aguardando-assinatura";
  if (status === "arquivado") return "arquivado";
  return status as ContractStatus;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function electronicToListContract(c: ElectronicContract): Contract {
  const setup = getClientSetup(c.clienteId);
  const clientName = setup?.personal.nome || c.variaveis.cliente || "—";
  const company = setup?.personal.empresa || c.variaveis.empresa || "—";
  const status = mapElectronicStatus(c.status);

  return {
    id: c.id,
    number: c.numeroContrato,
    title: c.titulo,
    type: "Prestação de serviços",
    client: clientName,
    company,
    document: setup?.personal.documento || c.variaveis.cnpj || "—",
    status,
    statusLabel: STATUS_LABELS[c.status] ?? c.status,
    value: c.valor,
    valueFormatted: formatBRL(c.valor),
    responsible: {
      initials: initials(c.responsavelNome),
      name: c.responsavelNome,
    },
    createdBy: {
      initials: initials(c.responsavelNome),
      name: c.responsavelNome,
    },
    createdAt: c.dataCriacao,
    sentAt: c.dataEnvio ?? undefined,
    signedAt: c.dataAssinatura ?? undefined,
    updatedAt: c.dataAssinatura ?? c.dataCriacao,
    phone: setup?.personal.telefone || c.variaveis.telefone || "—",
    email: setup?.personal.email || c.variaveis.email || "—",
    signaturesCount: c.assinaturas.length,
    signaturesTotal: 2,
  };
}

/** Lista viva: só contratos criados no sistema (sem mocks). */
export function getContratosList(): ContratosData {
  const contracts = getAllElectronicContracts().map(electronicToListContract);
  const assinados = contracts.filter((c) => c.status === "assinado" || c.status === "finalizado").length;
  const aguardando = contracts.filter((c) => c.status === "aguardando-assinatura").length;
  const valorTotal = contracts.reduce((s, c) => s + c.value, 0);

  return {
    ...contratosData,
    contracts,
    stats: [
      {
        id: "total",
        title: "Total de contratos",
        value: String(contracts.length),
        icon: "FileText",
        subtitle: formatBRL(valorTotal),
      },
      {
        id: "signed",
        title: "Assinados",
        value: String(assinados),
        icon: "CheckCircle2",
        subtitle: `${Math.round((assinados / (contracts.length || 1)) * 100)}%`,
      },
      {
        id: "pending",
        title: "Aguardando",
        value: String(aguardando),
        icon: "Clock",
        subtitleDirection: aguardando > 0 ? "warning" : "neutral",
      },
      {
        id: "value",
        title: "Valor total",
        value: formatBRL(valorTotal),
        icon: "Wallet",
      },
    ],
  };
}

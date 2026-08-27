import type { ContractViewData } from "@/lib/mock-data/contract-view-types";
import { contratosData } from "@/lib/mock-data/contratos";
import type { Contract } from "@/lib/mock-data/contratos-types";
import { getElectronicContract } from "@/mock/electronic-contracts/store";
import { toContractDocumentData } from "@/modules/electronic-contracts/adapter";

const defaultContract: ContractViewData = {
  id: "c1",
  number: "NX-2026-0148",
  title: "Contrato Nº NX-2026-0148",
  subtitle: "Prestação de Serviços de Desenvolvimento de Site Institucional",
  status: "aguardando-assinatura",
  statusLabel: "Aguardando assinatura",
  statusVariant: "aguardando-assinatura",
  company: {
    name: "Norax",
    legalName: "Norax Studio LTDA",
    cnpj: "45.678.901/0001-23",
    address: "Av. Paulista, 1000 — Bela Vista",
    city: "São Paulo — SP",
    email: "contato@norax.studio",
    phone: "(11) 3000-0000",
    representative: "Murilo Lima",
  },
  client: {
    name: "Infinity Store LTDA",
    company: "Infinity Store LTDA",
    cpfCnpj: "12.345.678/0001-90",
    address: "Rua das Flores, 250 — Centro",
    city: "São Paulo — SP",
    email: "contato@infinitystore.com.br",
    phone: "(11) 98765-4321",
    representative: "Ana Silva",
  },
  value: "R$ 5.900,00",
  valueRaw: 5900,
  paymentMethod: "Pix",
  installments: "Pagamento único",
  deadline: "45 dias úteis",
  template: "Prestação de Serviços",
  createdAt: "08/07/2026",
  createdTime: "08:10",
  sentAt: "08/07/2026",
  sentTime: "08:12",
  contractDate: "08/07/2026",
  link: "https://norax.studio/c/NX-2026-0148",
  signaturesCount: 1,
  signaturesTotal: 2,
  uniqueCode: "NX-2026-0148",
  hash: "8A7F3C2E91B4D6F8A0C1E2B3D4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3",
  hashShort: "8A7F...D93B",
  issuedAt: "08/07/2026 às 08:10",
  lastValidation: "08/07/2026 às 14:32",
  protected: true,
  signatures: [
    {
      role: "empresa",
      roleLabel: "Empresa",
      name: "Murilo Lima",
      document: "Norax Studio LTDA — 45.678.901/0001-23",
      date: "08/07/2026",
      time: "08:11",
      code: "SIG-NX-7F2A9C",
      status: "assinado",
    },
    {
      role: "cliente",
      roleLabel: "Cliente",
      name: "Ana Silva",
      document: "Infinity Store LTDA — 12.345.678/0001-90",
      status: "pendente",
    },
  ],
  timeline: [
    {
      id: "t1",
      title: "Contrato criado",
      description: "Murilo Lima",
      date: "08/07/2026",
      time: "08:10",
      completed: true,
    },
    {
      id: "t2",
      title: "Contrato enviado",
      description: "Sistema",
      date: "08/07/2026",
      time: "08:12",
      completed: true,
    },
    {
      id: "t3",
      title: "Cliente abriu",
      description: "Ana Silva",
      date: "08/07/2026",
      time: "09:45",
      completed: true,
    },
    {
      id: "t4",
      title: "Código validado",
      description: "Sistema",
      date: "08/07/2026",
      time: "09:46",
      completed: true,
    },
    {
      id: "t5",
      title: "Documento visualizado",
      description: "Ana Silva",
      date: "08/07/2026",
      time: "14:30",
      completed: true,
    },
    {
      id: "t6",
      title: "Assinatura realizada",
      description: "Aguardando cliente",
      date: "—",
      time: "—",
      completed: false,
      pending: true,
    },
    {
      id: "t7",
      title: "Empresa assinou",
      description: "Murilo Lima",
      date: "08/07/2026",
      time: "08:11",
      completed: true,
    },
    {
      id: "t8",
      title: "Contrato finalizado",
      description: "Pendente",
      date: "—",
      time: "—",
      completed: false,
    },
  ],
  metadata: {
    internalId: "CTR-2026-0148",
    version: "1.0",
    views: 12,
    authorizedDevices: 2,
    lastAccess: "08/07/2026 às 14:32",
    ip: "187.45.**.***",
  },
};

const contractsById: Record<string, ContractViewData> = {
  c1: defaultContract,
  "NX-2026-00127": {
    ...defaultContract,
    id: "c1",
    number: "NX-2026-00127",
    title: "Contrato Nº NX-2026-00127",
    uniqueCode: "NX-2026-00127",
  },
  "NX-2026-0148": defaultContract,
};

function mapStatusVariant(
  status: Contract["status"]
): ContractViewData["statusVariant"] {
  switch (status) {
    case "assinado":
      return "assinado";
    case "finalizado":
      return "finalizado";
    case "rascunho":
    case "arquivado":
    case "expirado":
      return "rascunho";
    case "cancelado":
      return "rascunho";
    case "enviado":
    case "aguardando-assinatura":
    default:
      return "aguardando-assinatura";
  }
}

function fromListContract(contract: Contract): ContractViewData {
  const clientSigned = contract.status === "assinado" || contract.status === "finalizado";

  return {
    ...defaultContract,
    id: contract.id,
    number: contract.number,
    title: `Contrato Nº ${contract.number}`,
    subtitle: contract.title,
    status: contract.status,
    statusLabel: contract.statusLabel,
    statusVariant: mapStatusVariant(contract.status),
    client: {
      ...defaultContract.client,
      name: contract.client,
      company: contract.company,
      cpfCnpj: contract.document,
      email: contract.email,
      phone: contract.phone,
      representative: contract.responsible.name,
    },
    value: contract.valueFormatted,
    valueRaw: contract.value,
    createdAt: contract.createdAt,
    sentAt: contract.sentAt ?? "—",
    contractDate: contract.createdAt,
    signaturesCount: contract.signaturesCount,
    signaturesTotal: contract.signaturesTotal,
    uniqueCode: contract.number,
    link: `https://norax.studio/c/${contract.number}`,
    signatures: [
      {
        role: "empresa",
        roleLabel: "Empresa",
        name: contract.createdBy.name,
        document: `${defaultContract.company.legalName} — ${defaultContract.company.cnpj}`,
        date: contract.createdAt,
        time: "08:11",
        code: `SIG-${contract.number.slice(-4)}`,
        status: "assinado",
      },
      {
        role: "cliente",
        roleLabel: "Cliente",
        name: contract.responsible.name,
        document: `${contract.company} — ${contract.document}`,
        status: clientSigned ? "assinado" : "pendente",
        date: clientSigned ? contract.signedAt : undefined,
        time: clientSigned ? "14:30" : undefined,
        code: clientSigned ? `SIG-CL-${contract.number.slice(-4)}` : undefined,
      },
    ],
    metadata: {
      ...defaultContract.metadata,
      internalId: `CTR-${contract.number.replace("NX-", "")}`,
      lastAccess: `${contract.updatedAt} às 14:32`,
    },
  };
}

export function getContractView(id: string): ContractViewData | null {
  const electronic = getElectronicContract(id);
  if (electronic) {
    return toContractDocumentData(electronic);
  }

  if (contractsById[id]) {
    return contractsById[id];
  }

  const fromNumber = contratosData.contracts.find((c) => c.number === id);
  if (fromNumber) {
    return fromListContract(fromNumber);
  }

  const fromId = contratosData.contracts.find((c) => c.id === id);
  if (fromId) {
    return fromListContract(fromId);
  }

  return null;
}

export const contractViewMock = defaultContract;

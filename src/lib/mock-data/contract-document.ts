import type {
  ContractDocumentData,
  ContractHistoryEvent,
  ContractPageContent,
} from "@/lib/mock-data/contract-document-types";
import { getContractView } from "@/lib/mock-data/contract-view";
import { getElectronicContract } from "@/mock/electronic-contracts/store";
import { toContractDocumentData } from "@/modules/electronic-contracts/adapter";

const CLAUSE_SECTIONS = [
  {
    number: "01",
    title: "OBJETO DO CONTRATO",
    paragraphs: [
      "O presente contrato tem por objeto a prestação de serviços de desenvolvimento de site institucional, incluindo planejamento, design, implementação, testes, publicação e entrega dos entregáveis acordados entre as partes.",
      "O escopo compreende páginas institucionais, integração de formulários, configuração de ambiente e documentação básica de uso.",
    ],
  },
  {
    number: "02",
    title: "PRAZO",
    paragraphs: [
      "O prazo para execução dos serviços será conforme estabelecido no cronograma aprovado, contado a partir da assinatura deste instrumento e confirmação dos pagamentos iniciais, quando aplicável.",
    ],
  },
  {
    number: "03",
    title: "VALORES",
    paragraphs: [
      "Pela execução dos serviços, a CONTRATANTE pagará à CONTRATADA o valor total acordado, conforme condições de pagamento definidas neste instrumento.",
    ],
  },
  {
    number: "04",
    title: "PAGAMENTO",
    paragraphs: [
      "O pagamento será realizado na forma e prazos acordados entre as partes, mediante emissão de nota fiscal após cada etapa concluída, quando aplicável.",
    ],
  },
  {
    number: "05",
    title: "OBRIGAÇÕES",
    paragraphs: [
      "A CONTRATADA compromete-se a executar os serviços com zelo, diligência e observância das melhores práticas do mercado.",
      "A CONTRATANTE compromete-se a fornecer informações, materiais e aprovações necessárias no prazo acordado.",
    ],
  },
  {
    number: "06",
    title: "GARANTIAS",
    paragraphs: [
      "A CONTRATADA oferece garantia de 30 (trinta) dias para correção de defeitos técnicos relacionados ao escopo contratado, contados a partir da entrega final.",
    ],
  },
  {
    number: "07",
    title: "LGPD",
    paragraphs: [
      "As partes comprometem-se a tratar dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), adotando medidas técnicas e administrativas adequadas.",
    ],
  },
  {
    number: "08",
    title: "FORO",
    paragraphs: [
      "Fica eleito o foro da comarca de São Paulo — SP para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.",
    ],
  },
];

function buildPages(): ContractPageContent[] {
  // Empacota o máximo por página (alinhado ao adapter real)
  const chunks: (typeof CLAUSE_SECTIONS)[] = [];
  const perPage = 4;
  for (let i = 0; i < CLAUSE_SECTIONS.length; i += perPage) {
    chunks.push(CLAUSE_SECTIONS.slice(i, i + perPage));
  }

  const contentPages: ContractPageContent[] = chunks.map((sections, i) =>
    i === 0
      ? { id: 1, type: "cover" as const, title: "Capa", sections }
      : { id: i + 1, type: "content" as const, sections }
  );

  const lastId = contentPages[contentPages.length - 1]?.id ?? 1;
  return [
    ...contentPages,
    { id: lastId + 1, type: "signatures", title: "Assinaturas" },
  ];
}

function buildHistory(): ContractHistoryEvent[] {
  return [
    { id: "h1", title: "Contrato criado", date: "08/07/2026", time: "08:10", responsible: "Murilo Lima" },
    { id: "h2", title: "Contrato enviado", date: "08/07/2026", time: "08:12", responsible: "Sistema" },
    { id: "h3", title: "Primeiro acesso", date: "08/07/2026", time: "09:45", responsible: "Ana Silva" },
    { id: "h4", title: "Código validado", date: "08/07/2026", time: "09:46", responsible: "Sistema" },
    { id: "h5", title: "Novo dispositivo autorizado", date: "08/07/2026", time: "10:02", responsible: "Ana Silva" },
    { id: "h6", title: "Empresa assinou", date: "08/07/2026", time: "08:11", responsible: "Murilo Lima" },
    { id: "h7", title: "Visualização", date: "08/07/2026", time: "14:30", responsible: "Ana Silva" },
    { id: "h8", title: "Download realizado", date: "08/07/2026", time: "14:31", responsible: "Ana Silva" },
  ];
}

export function getContractDocument(id: string): ContractDocumentData | null {
  const electronic = getElectronicContract(id);
  if (electronic) return toContractDocumentData(electronic);

  const base = getContractView(id);
  if (!base) return null;

  const pages = buildPages();

  return {
    ...base,
    totalPages: pages.length,
    pages,
    accessCode: "483291",
    shareLink: `https://contratos.norax.com.br/c/${base.number}-83K2S91A`,
    qrValue: base.uniqueCode,
    history: buildHistory(),
    statusVariant: base.statusVariant === "aguardando-assinatura" ? "assinado" : base.statusVariant,
    statusLabel: base.statusVariant === "aguardando-assinatura" ? "Assinado" : base.statusLabel,
  };
}

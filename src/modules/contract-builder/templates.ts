import type { ClauseBlock, ContractTemplateDef, ContractTemplateKind } from "@/modules/contract-builder/types";

function block(titulo: string, ...paragrafos: string[]): Omit<ClauseBlock, "id" | "ordem"> {
  return { titulo, paragrafos };
}

const COMMON_TAIL: Omit<ClauseBlock, "id" | "ordem">[] = [
  block(
    "OBRIGAÇÕES DA CONTRATADA",
    "A CONTRATADA compromete-se a executar os serviços com zelo, diligência e observância das melhores práticas do mercado, entregando os resultados conforme o escopo acordado."
  ),
  block(
    "OBRIGAÇÕES DO CONTRATANTE",
    "O CONTRATANTE compromete-se a fornecer informações, materiais e aprovações necessárias no prazo acordado, bem como efetuar os pagamentos nas condições estabelecidas."
  ),
  block(
    "SUPORTE",
    "A CONTRATADA prestará suporte técnico relacionado ao escopo contratado durante o período de garantia, conforme condições deste instrumento."
  ),
  block(
    "GARANTIA",
    "A CONTRATADA oferece garantia de 30 (trinta) dias para correção de defeitos técnicos relacionados ao escopo contratado, contados a partir da entrega final."
  ),
  block(
    "CONFIDENCIALIDADE",
    "As partes comprometem-se a manter sigilo sobre informações confidenciais trocadas durante a vigência deste contrato, sob pena das sanções cabíveis."
  ),
  block(
    "RESCISÃO",
    "O presente contrato poderá ser rescindido por qualquer das partes mediante comunicação escrita com antecedência mínima de 15 (quinze) dias, respeitadas as obrigações já assumidas."
  ),
  block(
    "FORO",
    "Fica eleito o foro da comarca de {{cidade}} — {{estado}} para dirimir controvérsias oriundas deste contrato."
  ),
  block(
    "DISPOSIÇÕES FINAIS",
    "E por estarem assim justas e contratadas, as partes assinam o presente instrumento em meio eletrônico, com validade jurídica nos termos da legislação vigente."
  ),
];

function withCommon(
  head: Omit<ClauseBlock, "id" | "ordem">[]
): Omit<ClauseBlock, "id" | "ordem">[] {
  return [...head, ...COMMON_TAIL];
}

export const CONTRACT_TEMPLATES: ContractTemplateDef[] = [
  {
    kind: "site_institucional",
    nome: "Site Institucional",
    descricao: "Desenvolvimento de site institucional completo",
    clausulas: withCommon([
      block(
        "OBJETO",
        "O presente contrato tem por objeto a prestação de serviços de desenvolvimento de site institucional ({{projeto}}), conforme escopo acordado entre {{empresa_norax}} e {{empresa}}."
      ),
      block(
        "PRAZO",
        "O prazo para execução dos serviços será de {{prazo}}, contados a partir da assinatura deste instrumento e confirmação do pagamento inicial, quando aplicável."
      ),
      block(
        "VALORES",
        "Pelos serviços descritos, o CONTRATANTE pagará à CONTRATADA o valor total de {{valor}}."
      ),
      block(
        "FORMA DE PAGAMENTO",
        "O pagamento será realizado conforme: {{forma_pagamento}}. Dados bancários da CONTRATADA: Banco {{banco}}, Agência {{agencia}}, Conta {{conta}}, PIX {{chave_pix}} ({{destinatario_pix}})."
      ),
    ]),
  },
  {
    kind: "landing_page",
    nome: "Landing Page",
    descricao: "Página de conversão focada em campanhas",
    clausulas: withCommon([
      block("OBJETO", "Prestação de serviços de criação de landing page para {{projeto}}, incluindo design, implementação e publicação."),
      block("PRAZO", "Prazo estimado de {{prazo}} a partir da assinatura."),
      block("VALORES", "Valor total de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}. PIX: {{chave_pix}}."),
    ]),
  },
  {
    kind: "sistema_web",
    nome: "Sistema Web",
    descricao: "Sistema web sob medida",
    clausulas: withCommon([
      block("OBJETO", "Desenvolvimento de sistema web {{projeto}}, conforme requisitos levantados entre as partes."),
      block("PRAZO", "Cronograma de {{prazo}}, sujeito a aprovações do CONTRATANTE."),
      block("VALORES", "Valor total de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}."),
    ]),
  },
  {
    kind: "aplicativo",
    nome: "Aplicativo",
    descricao: "Aplicativo mobile",
    clausulas: withCommon([
      block("OBJETO", "Desenvolvimento de aplicativo {{projeto}} para as plataformas acordadas."),
      block("PRAZO", "Prazo de {{prazo}}."),
      block("VALORES", "Valor total de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}."),
    ]),
  },
  {
    kind: "loja_virtual",
    nome: "Loja Virtual",
    descricao: "E-commerce completo",
    clausulas: withCommon([
      block("OBJETO", "Implantação de loja virtual {{projeto}}, incluindo catálogo, checkout e integrações básicas."),
      block("PRAZO", "Prazo de {{prazo}}."),
      block("VALORES", "Valor total de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}."),
    ]),
  },
  {
    kind: "identidade_visual",
    nome: "Identidade Visual",
    descricao: "Branding e identidade",
    clausulas: withCommon([
      block("OBJETO", "Criação de identidade visual para {{empresa}}, projeto {{projeto}}."),
      block("PRAZO", "Prazo de {{prazo}}."),
      block("VALORES", "Valor total de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}."),
    ]),
  },
  {
    kind: "hospedagem",
    nome: "Hospedagem",
    descricao: "Hospedagem e infraestrutura",
    clausulas: withCommon([
      block("OBJETO", "Prestação de serviços de hospedagem e infraestrutura para {{projeto}}."),
      block("PRAZO", "Vigência conforme {{prazo}}."),
      block("VALORES", "Valor de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}."),
    ]),
  },
  {
    kind: "manutencao",
    nome: "Manutenção",
    descricao: "Manutenção mensal",
    clausulas: withCommon([
      block("OBJETO", "Serviços de manutenção e suporte contínuo para {{projeto}}."),
      block("PRAZO", "Vigência de {{prazo}}."),
      block("VALORES", "Valor de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}."),
    ]),
  },
  {
    kind: "consultoria",
    nome: "Consultoria",
    descricao: "Consultoria especializada",
    clausulas: withCommon([
      block("OBJETO", "Prestação de consultoria em {{projeto}} para {{empresa}}."),
      block("PRAZO", "Prazo de {{prazo}}."),
      block("VALORES", "Valor de {{valor}}."),
      block("FORMA DE PAGAMENTO", "{{forma_pagamento}}."),
    ]),
  },
];

export function getTemplate(kind: ContractTemplateKind): ContractTemplateDef {
  return CONTRACT_TEMPLATES.find((t) => t.kind === kind) ?? CONTRACT_TEMPLATES[0];
}

export function materializeTemplate(kind: ContractTemplateKind): ClauseBlock[] {
  const tpl = getTemplate(kind);
  return tpl.clausulas.map((c, i) => ({
    id: `blk-${kind}-${i}-${Date.now().toString(36)}`,
    titulo: c.titulo,
    paragrafos: [...c.paragrafos],
    ordem: i,
  }));
}

export function renumberBlocks(blocks: ClauseBlock[]): ClauseBlock[] {
  return [...blocks]
    .sort((a, b) => a.ordem - b.ordem)
    .map((b, i) => ({ ...b, ordem: i }));
}

export function formatBlockNumber(ordem: number): string {
  return String(ordem + 1).padStart(2, "0");
}

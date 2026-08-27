import type { ClientSetupProfile } from "@/modules/client-setup/types";
import { formatPaymentLabel } from "@/modules/client-setup/store";
import type { ClauseBlock, ContractTemplateKind } from "@/modules/contract-builder/types";
import { materializeTemplate, renumberBlocks } from "@/modules/contract-builder/templates";
import type { ContractClause, ContractVariableValues } from "@/mock/electronic-contracts/types";

export interface AutoContractPayload {
  clienteId: string;
  projetoNome: string;
  titulo: string;
  valor: number;
  formaPagamento: string;
  parcelas: number;
  prazo: string;
  responsavelId: string;
  responsavelNome: string;
  templateKind: ContractTemplateKind;
  clausulas: ContractClause[];
  clauseBlocks: ClauseBlock[];
  variaveis: ContractVariableValues & Record<string, string>;
}

function resolveVars(
  text: string,
  vars: Record<string, string>
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

export function buildVariablesFromSetup(profile: ClientSetupProfile): Record<string, string> {
  const { personal, service, payment, norax } = profile;
  return {
    cliente: personal.nome,
    empresa: personal.empresa,
    cpf: personal.documento,
    cnpj: personal.documento,
    documento: personal.documento,
    valor: service.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    data: new Date().toLocaleDateString("pt-BR"),
    projeto: service.nomeProjeto || service.tipoServico,
    endereco: personal.endereco,
    telefone: personal.telefone,
    email: personal.email,
    cidade: personal.cidade,
    estado: personal.estado,
    prazo: service.prazoPrevisto || "conforme cronograma",
    forma_pagamento: formatPaymentLabel(payment),
    empresa_norax: norax.razaoSocial,
    banco: norax.banco,
    agencia: norax.agencia,
    conta: norax.conta,
    chave_pix: norax.chavePix,
    destinatario_pix: norax.destinatarioPix,
    responsavel: service.responsavelInternoNome,
  };
}

export function blocksToClauses(blocks: ClauseBlock[], vars: Record<string, string>): ContractClause[] {
  return renumberBlocks(blocks).map((b) => ({
    id: b.id,
    numero: String(b.ordem + 1).padStart(2, "0"),
    titulo: b.titulo,
    paragrafos: b.paragrafos.map((p) => resolveVars(p, vars)),
  }));
}

export function buildAutoContractFromSetup(
  profile: ClientSetupProfile,
  templateKind: ContractTemplateKind = "site_institucional"
): AutoContractPayload {
  const vars = buildVariablesFromSetup(profile);
  const rawBlocks = materializeTemplate(templateKind);
  const resolvedBlocks = renumberBlocks(
    rawBlocks.map((b) => ({
      ...b,
      paragrafos: b.paragrafos.map((p) => resolveVars(p, vars)),
    }))
  );

  const parcelas =
    profile.payment.method === "cartao_parcelado" || profile.payment.method === "pix_personalizado"
      ? Math.max(1, profile.payment.installments)
      : profile.payment.method === "pix_50_50"
        ? 2
        : 1;

  return {
    clienteId: profile.clientId,
    projetoNome: profile.service.nomeProjeto || profile.service.tipoServico,
    titulo: `Contrato — ${profile.service.nomeProjeto || profile.service.tipoServico}`,
    valor: profile.service.valorTotal,
    formaPagamento: formatPaymentLabel(profile.payment),
    parcelas,
    prazo: profile.service.prazoPrevisto || profile.service.dataInicio,
    responsavelId: profile.service.responsavelInternoId,
    responsavelNome: profile.service.responsavelInternoNome,
    templateKind,
    clausulas: blocksToClauses(resolvedBlocks, vars),
    clauseBlocks: resolvedBlocks,
    variaveis: {
      cliente: vars.cliente,
      empresa: vars.empresa,
      cpf: vars.cpf,
      cnpj: vars.cnpj,
      valor: vars.valor,
      data: vars.data,
      projeto: vars.projeto,
      endereco: vars.endereco,
      telefone: vars.telefone,
      email: vars.email,
      ...vars,
    },
  };
}

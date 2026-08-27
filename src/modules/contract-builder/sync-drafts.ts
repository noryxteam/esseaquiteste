import type { ClientSetupProfile } from "@/modules/client-setup/types";
import { buildVariablesFromSetup, blocksToClauses } from "@/modules/contract-builder/auto-generate";
import { getAllElectronicContracts, persistElectronicContract } from "@/mock/electronic-contracts/store";
import type { ClauseBlock } from "@/modules/contract-builder/types";

/**
 * Atualiza contratos em rascunho quando a ficha do cliente muda.
 * Contratos assinados / imutáveis nunca são alterados.
 */
export function syncDraftContractsFromClientSetup(
  profile: ClientSetupProfile,
  clauseBlocksByContract?: Map<string, ClauseBlock[]>
): number {
  const vars = buildVariablesFromSetup(profile);
  let updated = 0;

  for (const contract of getAllElectronicContracts()) {
    if (contract.clienteId !== profile.clientId) continue;
    if (contract.isImmutable) continue;
    if (contract.status !== "rascunho" && contract.status !== "em-revisao") continue;

    contract.valor = profile.service.valorTotal;
    contract.formaPagamento = vars.forma_pagamento;
    contract.prazo = profile.service.prazoPrevisto || contract.prazo;
    contract.responsavelNome = profile.service.responsavelInternoNome || contract.responsavelNome;
    if (profile.service.responsavelInternoId) {
      contract.responsavelId = profile.service.responsavelInternoId;
    }

    contract.variaveis = {
      ...contract.variaveis,
      cliente: vars.cliente,
      empresa: vars.empresa,
      cpf: vars.cpf,
      cnpj: vars.cnpj,
      valor: vars.valor,
      projeto: vars.projeto,
      endereco: vars.endereco,
      telefone: vars.telefone,
      email: vars.email,
    };

    const blocks = clauseBlocksByContract?.get(contract.id);
    if (blocks && blocks.length > 0) {
      contract.clausulas = blocksToClauses(blocks, vars);
    }

    persistElectronicContract(contract);
    updated += 1;
  }

  return updated;
}

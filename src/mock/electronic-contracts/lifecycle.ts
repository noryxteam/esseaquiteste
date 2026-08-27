import type { ContractLifecycleStep } from "@/mock/electronic-contracts/types";

/** Ordem estrita do fluxo — índice menor = etapa anterior */
export const LIFECYCLE_ORDER: ContractLifecycleStep[] = [
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

export function stepIndex(step: ContractLifecycleStep): number {
  return LIFECYCLE_ORDER.indexOf(step);
}

export function canAdvanceTo(
  current: ContractLifecycleStep,
  target: ContractLifecycleStep
): boolean {
  const cur = stepIndex(current);
  const tgt = stepIndex(target);
  if (cur < 0 || tgt < 0) return false;
  return tgt === cur + 1;
}

export function hasReachedStep(
  current: ContractLifecycleStep,
  required: ContractLifecycleStep
): boolean {
  return stepIndex(current) >= stepIndex(required);
}

export const LIFECYCLE_LABELS: Record<ContractLifecycleStep, string> = {
  criado: "Contrato criado",
  editado: "Conteúdo editado",
  campos_adicionados: "Campos preenchíveis adicionados",
  revisado: "Documento revisado",
  definitivo: "Versão definitiva gerada",
  enviado: "Contrato enviado ao cliente",
  cliente_acessou: "Cliente acessou o link",
  dispositivo_autorizado: "Dispositivo autorizado",
  cliente_leu: "Cliente leu o contrato",
  aceite_eletronico: "Aceite eletrônico confirmado",
  cliente_assinou: "Cliente assinou",
  norax_assinou: "Norax assinou",
  pdf_gerado: "PDF definitivo gerado",
  arquivado: "Contrato arquivado",
};

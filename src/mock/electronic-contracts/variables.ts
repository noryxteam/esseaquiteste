import type { ContractVariableValues } from "@/mock/electronic-contracts/types";

export function resolveVariables(text: string, vars: ContractVariableValues): string {
  return text
    .replace(/\{\{cliente\}\}/g, vars.cliente)
    .replace(/\{\{empresa\}\}/g, vars.empresa)
    .replace(/\{\{cpf\}\}/g, vars.cpf)
    .replace(/\{\{cnpj\}\}/g, vars.cnpj)
    .replace(/\{\{valor\}\}/g, vars.valor)
    .replace(/\{\{data\}\}/g, vars.data)
    .replace(/\{\{projeto\}\}/g, vars.projeto)
    .replace(/\{\{endereco\}\}/g, vars.endereco)
    .replace(/\{\{telefone\}\}/g, vars.telefone)
    .replace(/\{\{email\}\}/g, vars.email);
}

export function resolveClausulas<T extends { titulo: string; paragrafos: string[] }>(
  clausulas: T[],
  vars: ContractVariableValues
): T[] {
  return clausulas.map((c) => ({
    ...c,
    titulo: resolveVariables(c.titulo, vars),
    paragrafos: c.paragrafos.map((p) => resolveVariables(p, vars)),
  }));
}

import { getSeedData } from "@/mock/seed";
import type { ContractStatus, MockContract } from "./types";

export * from "./types";
export { contracts } from "./data";

export function getContracts(): MockContract[] {
  return getSeedData().contracts;
}

export function getContractById(id: string): MockContract | undefined {
  return getSeedData().contracts.find((c) => c.id === id);
}

export function getContractsByClientId(clienteId: string): MockContract[] {
  return getSeedData().contracts.filter((c) => c.clienteId === clienteId);
}

export function getContractsByProjectId(projetoId: string): MockContract[] {
  return getSeedData().contracts.filter((c) => c.projetoId === projetoId);
}

export function getContractsByStatus(status: ContractStatus): MockContract[] {
  return getSeedData().contracts.filter((c) => c.status === status);
}

export function getContractByToken(token: string): MockContract | undefined {
  return getSeedData().contracts.find((c) => c.token === token);
}

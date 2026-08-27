import { getSeedData } from "@/mock/seed";
import type { FinanceStatus, FinanceType, MockFinanceMovement } from "./types";

export * from "./types";
export { financeMovements } from "./data";

export function getFinanceMovements(): MockFinanceMovement[] {
  return getSeedData().finance;
}

export function getFinanceMovementById(id: string): MockFinanceMovement | undefined {
  return getSeedData().finance.find((f) => f.id === id);
}

export function getFinanceByClientId(clienteId: string): MockFinanceMovement[] {
  return getSeedData().finance.filter((f) => f.clienteId === clienteId);
}

export function getFinanceByContractId(contratoId: string): MockFinanceMovement[] {
  return getSeedData().finance.filter((f) => f.contratoId === contratoId);
}

export function getFinanceByType(tipo: FinanceType): MockFinanceMovement[] {
  return getSeedData().finance.filter((f) => f.tipo === tipo);
}

export function getFinanceByStatus(status: FinanceStatus): MockFinanceMovement[] {
  return getSeedData().finance.filter((f) => f.status === status);
}

export function getTotalReceita(): number {
  return getSeedData()
    .finance.filter((f) => f.tipo === "receita" && f.status === "pago")
    .reduce((sum, f) => sum + f.valor, 0);
}

export function getTotalDespesas(): number {
  return getSeedData()
    .finance.filter((f) => f.tipo === "despesa")
    .reduce((sum, f) => sum + f.valor, 0);
}

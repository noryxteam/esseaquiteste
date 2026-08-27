import { getSeedData } from "@/mock/seed";
import type { MockReports } from "./types";

export * from "./types";
export { reports } from "./data";

export function getReports(): MockReports {
  return getSeedData().reports;
}

export function getFaturamentoMensal() {
  return getSeedData().reports.faturamentoMensal;
}

export function getLucroMensal() {
  return getSeedData().reports.lucroMensal;
}

export function getReceitasMensal() {
  return getSeedData().reports.receitasMensal;
}

export function getDespesasMensal() {
  return getSeedData().reports.despesasMensal;
}

export function getConversaoMensal() {
  return getSeedData().reports.conversaoMensal;
}

export function getNovosClientesMensal() {
  return getSeedData().reports.novosClientesMensal;
}

export function getProjetosEntreguesMensal() {
  return getSeedData().reports.projetosEntreguesMensal;
}

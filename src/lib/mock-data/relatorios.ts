import { buildRelatoriosDataset } from "@/lib/mock-data/adapters";
import type { RelatoriosData, RelatoriosDataset, ReportPeriod } from "@/lib/mock-data/relatorios-types";

export const relatoriosData: RelatoriosDataset = buildRelatoriosDataset();

export function getRelatoriosData(period: ReportPeriod): RelatoriosData {
  return relatoriosData[period];
}

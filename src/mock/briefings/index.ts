import { getSeedData } from "@/mock/seed";
import type { MockBriefing } from "./types";

export * from "./types";
export { briefings } from "./data";

export function getBriefings(): MockBriefing[] {
  return getSeedData().briefings;
}

export function getBriefingById(id: string): MockBriefing | undefined {
  return getSeedData().briefings.find((b) => b.id === id);
}

export function getBriefingsByClientId(clienteId: string): MockBriefing[] {
  return getSeedData().briefings.filter((b) => b.clienteId === clienteId);
}

export function getBriefingByProjectId(projetoId: string): MockBriefing | undefined {
  return getSeedData().briefings.find((b) => b.projetoId === projetoId);
}

import { getSeedData } from "@/mock/seed";
import type { ClientStatus, MockClient } from "./types";

export * from "./types";
export { clients } from "./data";

export function getClients(): MockClient[] {
  return getSeedData().clients;
}

export function getClientById(id: string): MockClient | undefined {
  return getSeedData().clients.find((c) => c.id === id);
}

export function getClientsByStatus(status: ClientStatus): MockClient[] {
  return getSeedData().clients.filter((c) => c.status === status);
}

export function getClientsByResponsavel(responsavelId: string): MockClient[] {
  return getSeedData().clients.filter((c) => c.responsavelId === responsavelId);
}

export function getClientsBySegmento(segmento: string): MockClient[] {
  return getSeedData().clients.filter((c) => c.segmento === segmento);
}

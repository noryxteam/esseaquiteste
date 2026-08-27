import { getSeedData } from "@/mock/seed";
import type { MockTimelineEvent, TimelineEventType } from "./types";

export * from "./types";
export { timelineEvents } from "./data";

export function getTimelineEvents(): MockTimelineEvent[] {
  return getSeedData().timeline;
}

export function getTimelineEventById(id: string): MockTimelineEvent | undefined {
  return getSeedData().timeline.find((e) => e.id === id);
}

export function getTimelineByClientId(clienteId: string): MockTimelineEvent[] {
  return getSeedData().timeline.filter((e) => e.clienteId === clienteId);
}

export function getTimelineByProjectId(projetoId: string): MockTimelineEvent[] {
  return getSeedData().timeline.filter((e) => e.projetoId === projetoId);
}

export function getTimelineByType(tipo: TimelineEventType): MockTimelineEvent[] {
  return getSeedData().timeline.filter((e) => e.tipo === tipo);
}

export function getRecentTimeline(limit = 20): MockTimelineEvent[] {
  return getSeedData().timeline.slice(0, limit);
}

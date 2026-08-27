import { getSeedData } from "@/mock/seed";
import type { MeetingStatus, MockMeeting } from "./types";

export * from "./types";
export { meetings } from "./data";

export function getMeetings(): MockMeeting[] {
  return getSeedData().meetings;
}

export function getMeetingById(id: string): MockMeeting | undefined {
  return getSeedData().meetings.find((m) => m.id === id);
}

export function getMeetingsByClientId(clienteId: string): MockMeeting[] {
  return getSeedData().meetings.filter((m) => m.clienteId === clienteId);
}

export function getMeetingsByProjectId(projetoId: string): MockMeeting[] {
  return getSeedData().meetings.filter((m) => m.projetoId === projetoId);
}

export function getMeetingsByStatus(status: MeetingStatus): MockMeeting[] {
  return getSeedData().meetings.filter((m) => m.status === status);
}

export function getMeetingsByDate(data: string): MockMeeting[] {
  return getSeedData().meetings.filter((m) => m.data === data);
}

export function getUpcomingMeetings(limit = 10): MockMeeting[] {
  const today = getSeedData().meetings
    .map((m) => m.data)
    .sort()
    .at(-1);
  if (!today) return [];

  return getSeedData()
    .meetings.filter((m) => m.data >= today && m.status !== "cancelada")
    .sort((a, b) => (a.data > b.data ? 1 : a.data < b.data ? -1 : a.inicio.localeCompare(b.inicio)))
    .slice(0, limit);
}

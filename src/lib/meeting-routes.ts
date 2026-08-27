import { getMeetingIntelligence } from "@/lib/mock-data/meeting-intelligence";

export function getMeetingDetailHref(meetingId: string): string | null {
  if (!getMeetingIntelligence(meetingId)) return null;
  return `/reunioes/${meetingId}`;
}

export function getMeetingAIEngineHref(meetingId: string): string | null {
  if (!getMeetingIntelligence(meetingId)) return null;
  return `/reunioes/${meetingId}/ai-engine`;
}

export function hasMeetingIntelligence(meetingId: string): boolean {
  return getMeetingIntelligence(meetingId) !== null;
}

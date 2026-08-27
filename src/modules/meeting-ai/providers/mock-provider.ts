import type { IMeetingAIProvider } from "@/modules/meeting-ai/types/provider";
import type { MeetingAudio, MeetingAIProviderResult } from "@/modules/meeting-ai/types";
import {
  mockAudio,
  mockBriefing,
  mockDecisions,
  mockExecutiveSummary,
  mockInsights,
  mockSession,
  mockTasks,
  mockTimeline,
  mockTranscript,
} from "@/modules/meeting-ai/mock";
import { delay } from "@/modules/meeting-ai/utils";

const MOCK_DELAY = 600;

export class MockProvider implements IMeetingAIProvider {
  readonly name = "mock";

  private recordingAudio: MeetingAudio | null = null;

  async startMeeting(meetingId: string) {
    await delay(MOCK_DELAY);
    return { success: true, data: { ...mockSession, id: meetingId } };
  }

  async stopMeeting(meetingId: string) {
    await delay(MOCK_DELAY);
    return {
      success: true,
      data: { ...mockSession, id: meetingId, endedAt: new Date().toISOString() },
    };
  }

  async startRecording(_meetingId: string): Promise<MeetingAIProviderResult<MeetingAudio>> {
    await delay(MOCK_DELAY);
    this.recordingAudio = { ...mockAudio, id: `audio-${Date.now()}`, status: "recording" };
    return { success: true, data: this.recordingAudio };
  }

  async stopRecording(_meetingId: string): Promise<MeetingAIProviderResult<MeetingAudio>> {
    await delay(MOCK_DELAY);
    const audio = { ...(this.recordingAudio ?? mockAudio), status: "pending" as const };
    this.recordingAudio = audio;
    return { success: true, data: audio };
  }

  async uploadAudio(_meetingId: string, audio: MeetingAudio) {
    await delay(MOCK_DELAY * 2);
    return { success: true, data: { ...audio, status: "uploaded" as const } };
  }

  async transcribe(_meetingId: string, _audio: MeetingAudio) {
    await delay(MOCK_DELAY * 3);
    return { success: true, data: mockTranscript };
  }

  async generateSummary(_meetingId: string, _transcript: typeof mockTranscript) {
    await delay(MOCK_DELAY * 2);
    return { success: true, data: mockExecutiveSummary };
  }

  async generateBriefing(_meetingId: string, _transcript: typeof mockTranscript) {
    await delay(MOCK_DELAY * 2);
    return { success: true, data: mockBriefing };
  }

  async generateTasks(_meetingId: string, _transcript: typeof mockTranscript) {
    await delay(MOCK_DELAY);
    return { success: true, data: mockTasks };
  }

  async generateDecisions(_meetingId: string, _transcript: typeof mockTranscript) {
    await delay(MOCK_DELAY);
    return { success: true, data: mockDecisions };
  }

  async generateTimeline(_meetingId: string, _transcript: typeof mockTranscript) {
    await delay(MOCK_DELAY);
    return { success: true, data: mockTimeline };
  }

  async generateInsights(_meetingId: string, _transcript: typeof mockTranscript) {
    await delay(MOCK_DELAY);
    return { success: true, data: mockInsights };
  }
}

export const mockProvider = new MockProvider();

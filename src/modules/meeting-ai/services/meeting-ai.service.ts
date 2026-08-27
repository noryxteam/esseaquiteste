import type { MeetingAIProviderName } from "@/modules/meeting-ai/types";
import { getMeetingAIProvider } from "@/modules/meeting-ai/providers";
import type { IMeetingAIProvider } from "@/modules/meeting-ai/types/provider";

export class MeetingAIService {
  constructor(private provider: IMeetingAIProvider) {}

  static create(providerName: MeetingAIProviderName = "mock") {
    return new MeetingAIService(getMeetingAIProvider(providerName));
  }

  getProvider() {
    return this.provider;
  }

  startMeeting(meetingId: string) {
    return this.provider.startMeeting(meetingId);
  }

  stopMeeting(meetingId: string) {
    return this.provider.stopMeeting(meetingId);
  }

  startRecording(meetingId: string) {
    return this.provider.startRecording(meetingId);
  }

  stopRecording(meetingId: string) {
    return this.provider.stopRecording(meetingId);
  }

  uploadAudio(meetingId: string, audio: Parameters<IMeetingAIProvider["uploadAudio"]>[1]) {
    return this.provider.uploadAudio(meetingId, audio);
  }

  transcribe(meetingId: string, audio: Parameters<IMeetingAIProvider["transcribe"]>[1]) {
    return this.provider.transcribe(meetingId, audio);
  }

  generateSummary(meetingId: string, transcript: Parameters<IMeetingAIProvider["generateSummary"]>[1]) {
    return this.provider.generateSummary(meetingId, transcript);
  }

  generateBriefing(meetingId: string, transcript: Parameters<IMeetingAIProvider["generateBriefing"]>[1]) {
    return this.provider.generateBriefing(meetingId, transcript);
  }

  generateTasks(meetingId: string, transcript: Parameters<IMeetingAIProvider["generateTasks"]>[1]) {
    return this.provider.generateTasks(meetingId, transcript);
  }

  generateDecisions(meetingId: string, transcript: Parameters<IMeetingAIProvider["generateDecisions"]>[1]) {
    return this.provider.generateDecisions(meetingId, transcript);
  }

  generateTimeline(meetingId: string, transcript: Parameters<IMeetingAIProvider["generateTimeline"]>[1]) {
    return this.provider.generateTimeline(meetingId, transcript);
  }

  generateInsights(meetingId: string, transcript: Parameters<IMeetingAIProvider["generateInsights"]>[1]) {
    return this.provider.generateInsights(meetingId, transcript);
  }
}

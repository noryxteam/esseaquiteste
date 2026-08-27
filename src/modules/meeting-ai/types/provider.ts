import type {
  MeetingAudio,
  MeetingBriefing,
  MeetingAIProviderResult,
  MeetingDecision,
  MeetingInsight,
  MeetingSession,
  MeetingTask,
  MeetingTimelineEvent,
  MeetingTranscriptEntry,
} from "@/modules/meeting-ai/types";

export interface IMeetingAIProvider {
  readonly name: string;

  startMeeting(meetingId: string): Promise<MeetingAIProviderResult<MeetingSession>>;
  stopMeeting(meetingId: string): Promise<MeetingAIProviderResult<MeetingSession>>;
  startRecording(meetingId: string): Promise<MeetingAIProviderResult<MeetingAudio>>;
  stopRecording(meetingId: string): Promise<MeetingAIProviderResult<MeetingAudio>>;
  uploadAudio(meetingId: string, audio: MeetingAudio): Promise<MeetingAIProviderResult<MeetingAudio>>;
  transcribe(
    meetingId: string,
    audio: MeetingAudio
  ): Promise<MeetingAIProviderResult<MeetingTranscriptEntry[]>>;
  generateSummary(
    meetingId: string,
    transcript: MeetingTranscriptEntry[]
  ): Promise<MeetingAIProviderResult<string>>;
  generateBriefing(
    meetingId: string,
    transcript: MeetingTranscriptEntry[]
  ): Promise<MeetingAIProviderResult<MeetingBriefing>>;
  generateTasks(
    meetingId: string,
    transcript: MeetingTranscriptEntry[]
  ): Promise<MeetingAIProviderResult<MeetingTask[]>>;
  generateDecisions(
    meetingId: string,
    transcript: MeetingTranscriptEntry[]
  ): Promise<MeetingAIProviderResult<MeetingDecision[]>>;
  generateTimeline(
    meetingId: string,
    transcript: MeetingTranscriptEntry[]
  ): Promise<MeetingAIProviderResult<MeetingTimelineEvent[]>>;
  generateInsights(
    meetingId: string,
    transcript: MeetingTranscriptEntry[]
  ): Promise<MeetingAIProviderResult<MeetingInsight[]>>;
}

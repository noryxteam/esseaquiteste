export type MeetingAIState =
  | "idle"
  | "preparing"
  | "recording"
  | "uploading"
  | "transcribing"
  | "analyzing"
  | "generating-briefing"
  | "finished"
  | "error";

export type MeetingFlowStep =
  | "preparing-meeting"
  | "entering-meeting"
  | "waiting-participants"
  | "starting-recording"
  | "recording"
  | "ending-meeting"
  | "uploading-audio"
  | "transcribing"
  | "analyzing"
  | "generating-briefing"
  | "generating-tasks"
  | "generating-summary"
  | "completed";

export type MeetingAIProviderName =
  | "mock"
  | "openai"
  | "google"
  | "assemblyai"
  | "deepgram";

export type AudioStatus = "pending" | "recording" | "uploaded" | "processed" | "error";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled";

export type InsightType = "risk" | "important" | "suggestion" | "improvement" | "pending";

export interface MeetingParticipant {
  id: string;
  name: string;
  role?: string;
  company: string;
  initials: string;
  isHost?: boolean;
}

export interface MeetingAudio {
  id: string;
  duration: number;
  size: number;
  format: string;
  language: string;
  sampleRate: number;
  participants: string[];
  status: AudioStatus;
  createdAt: string;
}

export interface MeetingTranscriptEntry {
  id: string;
  speaker: string;
  speakerRole?: string;
  text: string;
  startTime: string;
  endTime: string;
  confidence: number;
}

export interface MeetingTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  responsible: string;
  responsibleInitials: string;
  deadline: string;
  status: TaskStatus;
}

export interface MeetingDecision {
  id: string;
  title: string;
  description: string;
  responsible: string;
  date: string;
  impact: "low" | "medium" | "high";
}

export interface MeetingInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
}

export interface MeetingTimelineEvent {
  id: string;
  time: string;
  label: string;
  type?: "join" | "leave" | "share" | "system" | "decision";
}

export type SentimentLabel = "positivo" | "neutro" | "negativo";

export interface SentimentPoint {
  label: string;
  value: number;
}

export interface SentimentData {
  overall: SentimentLabel;
  overallDescription: string;
  timeline: SentimentPoint[];
}

export interface MeetingBriefing {
  title: string;
  project: string;
  client: string;
  responsible: string;
  participants: MeetingParticipant[];
  executiveSummary: string;
  objectives: string[];
  discussedTopics: string[];
  decisions: MeetingDecision[];
  pending: string[];
  nextSteps: { description: string; responsible: string; date: string }[];
  tasks: MeetingTask[];
  observations: string[];
  risks: string[];
  date: string;
  time: string;
  duration: string;
  version: string;
}

export interface MeetingSession {
  id: string;
  title: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  participants: MeetingParticipant[];
}

export interface MeetingMetrics {
  elapsedSeconds: number;
  participantCount: number;
  meetingDurationMinutes: number;
  wordCount: number;
  transcriptSegments: number;
}

export interface MeetingAIProviderResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MeetingAnalysisResult {
  summary: string;
  objectives: string[];
  decisions: string[];
  pending: string[];
  nextSteps: { description: string; responsible: string; date: string }[];
  keywords: string[];
  sentiment: SentimentData;
  generatedTasks: MeetingTask[];
  participants: MeetingParticipant[];
  risks?: string[];
  observations?: string[];
  scope?: string[];
  checklist?: string[];
  speakingTime?: { name: string; minutes: number }[];
  importantQuestions?: string[];
  actionItems?: string[];
}

export interface MeetingAIEngineState {
  meetingId: string | null;
  providerName: MeetingAIProviderName;
  state: MeetingAIState;
  flowStep: MeetingFlowStep;
  progress: number;
  error: string | null;
  session: MeetingSession | null;
  audio: MeetingAudio | null;
  transcript: MeetingTranscriptEntry[];
  briefing: MeetingBriefing | null;
  tasks: MeetingTask[];
  decisions: MeetingDecision[];
  insights: MeetingInsight[];
  timeline: MeetingTimelineEvent[];
  summary: string | null;
  metrics: MeetingMetrics;
  isRunning: boolean;
}

export const INITIAL_METRICS: MeetingMetrics = {
  elapsedSeconds: 0,
  participantCount: 0,
  meetingDurationMinutes: 0,
  wordCount: 0,
  transcriptSegments: 0,
};

export const INITIAL_ENGINE_STATE: MeetingAIEngineState = {
  meetingId: null,
  providerName: "mock",
  state: "idle",
  flowStep: "preparing-meeting",
  progress: 0,
  error: null,
  session: null,
  audio: null,
  transcript: [],
  briefing: null,
  tasks: [],
  decisions: [],
  insights: [],
  timeline: [],
  summary: null,
  metrics: INITIAL_METRICS,
  isRunning: false,
};

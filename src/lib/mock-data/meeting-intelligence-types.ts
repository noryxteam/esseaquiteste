export type MeetingIntelligenceTab =
  | "resumo-ia"
  | "transcricao"
  | "analise"
  | "briefing"
  | "tasks"
  | "historico";

export type MeetingStatus = "agendada" | "em-andamento" | "concluida";

export type SentimentLabel = "positivo" | "neutro" | "negativo";

export interface MeetingParticipantDetail {
  id: string;
  name: string;
  company: string;
  initials: string;
  avatarUrl?: string;
  role?: string;
}

export interface TranscriptMessage {
  id: string;
  timestamp: string;
  speakerName: string;
  speakerCompany: string;
  message: string;
}

export interface NextStepItem {
  id: string;
  description: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
}

export interface GeneratedTask {
  id: string;
  description: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  completed: boolean;
}

export interface SentimentPoint {
  label: string;
  value: number;
}

export interface SentimentData {
  overall: SentimentLabel;
  overallDescription: string;
  timeline: SentimentPoint[];
}

export interface MeetingInfoItem {
  id: string;
  label: string;
  value: string;
  icon: string;
  status?: "done" | "pending" | "none";
}

export interface NextMeetingData {
  date: string;
  time: string;
  title: string;
}

export interface VideoParticipant {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  isRecording?: boolean;
}

export interface MeetingAnalysisResult {
  summary: string;
  objectives: string[];
  scope?: string[];
  decisions: string[];
  pending: string[];
  risks?: string[];
  nextSteps: NextStepItem[];
  keywords: string[];
  sentiment: SentimentData;
  generatedTasks: GeneratedTask[];
  participants: MeetingParticipantDetail[];
  observations?: string[];
  checklist?: string[];
  speakingTime?: { name: string; minutes: number }[];
  importantQuestions?: string[];
  actionItems?: string[];
}

export interface MeetingIntelligenceData {
  id: string;
  title: string;
  status: MeetingStatus;
  statusLabel: string;
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  duration: string;
  participants: MeetingParticipantDetail[];
  videos: VideoParticipant[];
  transcript: TranscriptMessage[];
  analysis: MeetingAnalysisResult;
  meetingInfo: MeetingInfoItem[];
  nextMeeting: NextMeetingData;
}

export type MeetingTab = "agenda" | "todas" | "minhas";

export type MeetingType =
  | "planejamento"
  | "revisao"
  | "apresentacao"
  | "interna"
  | "comercial";

export type TrendDirection = "up" | "down" | "neutral" | "warning";

export interface MeetingParticipant {
  id?: string;
  email?: string;
  uuid?: string;
  initials: string;
  name: string;
}

export interface MeetingStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  subtitleDirection?: TrendDirection;
}

export interface Meeting {
  id: string;
  title: string;
  project: string;
  client: string;
  startTime: string;
  endTime: string;
  duration: string;
  date: string;
  participants: MeetingParticipant[];
  lead: MeetingParticipant;
  type: MeetingType;
  typeLabel: string;
  notes?: string;
  isMine?: boolean;
  hasMinutes?: boolean;
  status?: "agendada" | "em-andamento" | "concluida";
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  dayLabel: string;
  time: string;
}

export interface QuickNote {
  id: string;
  text: string;
  time: string;
}

export interface ReunioesData {
  stats: MeetingStat[];
  timelineMeetings: Meeting[];
  allMeetings: Meeting[];
  myMeetings: Meeting[];
  recentMeetings: Meeting[];
  upcoming: UpcomingMeeting[];
  quickNotes: QuickNote[];
  selectedMeetingId: string;
}

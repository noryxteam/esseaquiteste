export type MeetingStatus = "agendada" | "em-andamento" | "concluida" | "cancelada";

export interface MockMeetingParticipant {
  userId: string;
  nome: string;
  initials: string;
}

export interface MockMeeting {
  id: string;
  clienteId: string;
  projetoId: string;
  titulo: string;
  data: string;
  inicio: string;
  fim: string;
  participantes: MockMeetingParticipant[];
  status: MeetingStatus;
  gravacao: boolean;
  transcricao: boolean;
  briefingId: string | null;
}

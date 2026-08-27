import type { MeetingAIState, MeetingFlowStep } from "@/modules/meeting-ai/types";

export const FLOW_STEPS: MeetingFlowStep[] = [
  "preparing-meeting",
  "entering-meeting",
  "waiting-participants",
  "starting-recording",
  "recording",
  "ending-meeting",
  "uploading-audio",
  "transcribing",
  "analyzing",
  "generating-briefing",
  "generating-tasks",
  "generating-summary",
  "completed",
];

export const FLOW_STEP_LABELS: Record<MeetingFlowStep, string> = {
  "preparing-meeting": "Preparando reunião",
  "entering-meeting": "Entrando na reunião",
  "waiting-participants": "Aguardando participantes",
  "starting-recording": "Iniciando gravação",
  recording: "Gravando",
  "ending-meeting": "Encerrando reunião",
  "uploading-audio": "Enviando áudio",
  transcribing: "Transcrevendo",
  analyzing: "Analisando",
  "generating-briefing": "Gerando briefing",
  "generating-tasks": "Gerando tarefas",
  "generating-summary": "Gerando resumo",
  completed: "Concluído",
};

export const STATE_LABELS: Record<MeetingAIState, string> = {
  idle: "Aguardando",
  preparing: "Preparando",
  recording: "Gravando",
  uploading: "Enviando",
  transcribing: "Transcrevendo",
  analyzing: "Analisando",
  "generating-briefing": "Gerando briefing",
  finished: "Concluído",
  error: "Erro",
};

export function getProgressForStep(step: MeetingFlowStep): number {
  const index = FLOW_STEPS.indexOf(step);
  if (index < 0) return 0;
  return Math.round(((index + 1) / FLOW_STEPS.length) * 100);
}

export function mapFlowStepToState(step: MeetingFlowStep): MeetingAIState {
  switch (step) {
    case "preparing-meeting":
    case "entering-meeting":
    case "waiting-participants":
      return "preparing";
    case "starting-recording":
    case "recording":
    case "ending-meeting":
      return "recording";
    case "uploading-audio":
      return "uploading";
    case "transcribing":
      return "transcribing";
    case "analyzing":
      return "analyzing";
    case "generating-briefing":
    case "generating-tasks":
    case "generating-summary":
      return "generating-briefing";
    case "completed":
      return "finished";
    default:
      return "idle";
  }
}

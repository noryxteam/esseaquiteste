import type { IMeetingAIProvider } from "@/modules/meeting-ai/types/provider";
import type { MeetingAIProviderResult } from "@/modules/meeting-ai/types";

function notImplemented<T>(provider: string, method: string): MeetingAIProviderResult<T> {
  return {
    success: false,
    error: `[${provider}] ${method} não implementado. Conecte as credenciais da API.`,
  };
}

export function createStubProvider(name: string): IMeetingAIProvider {
  const stub = <T>() => notImplemented<T>(name, "método");

  return {
    name,
    startMeeting: async () => stub(),
    stopMeeting: async () => stub(),
    startRecording: async () => stub(),
    stopRecording: async () => stub(),
    uploadAudio: async () => stub(),
    transcribe: async () => stub(),
    generateSummary: async () => stub(),
    generateBriefing: async () => stub(),
    generateTasks: async () => stub(),
    generateDecisions: async () => stub(),
    generateTimeline: async () => stub(),
    generateInsights: async () => stub(),
  };
}

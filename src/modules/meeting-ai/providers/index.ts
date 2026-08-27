import type { MeetingAIProviderName } from "@/modules/meeting-ai/types";
import type { IMeetingAIProvider } from "@/modules/meeting-ai/types/provider";
import { assemblyAIProvider } from "@/modules/meeting-ai/providers/assembly-ai-provider";
import { deepgramProvider } from "@/modules/meeting-ai/providers/deepgram-provider";
import { googleAIProvider } from "@/modules/meeting-ai/providers/google-ai-provider";
import { mockProvider, MockProvider } from "@/modules/meeting-ai/providers/mock-provider";
import { openAIProvider } from "@/modules/meeting-ai/providers/openai-provider";

const providers: Record<MeetingAIProviderName, IMeetingAIProvider> = {
  mock: mockProvider,
  openai: openAIProvider,
  google: googleAIProvider,
  assemblyai: assemblyAIProvider,
  deepgram: deepgramProvider,
};

export function getMeetingAIProvider(name: MeetingAIProviderName = "mock"): IMeetingAIProvider {
  return providers[name] ?? mockProvider;
}

export function listMeetingAIProviders(): MeetingAIProviderName[] {
  return Object.keys(providers) as MeetingAIProviderName[];
}

export {
  mockProvider,
  MockProvider,
  openAIProvider,
  googleAIProvider,
  assemblyAIProvider,
  deepgramProvider,
};

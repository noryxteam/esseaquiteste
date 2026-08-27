"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { MeetingAIProviderName } from "@/modules/meeting-ai/types";
import { INITIAL_ENGINE_STATE } from "@/modules/meeting-ai/types";
import { meetingAIReducer } from "@/modules/meeting-ai/store/meeting-ai-reducer";
import { MeetingAIFlowService } from "@/modules/meeting-ai/services/meeting-ai-flow.service";
import { MeetingAIService } from "@/modules/meeting-ai/services/meeting-ai.service";

interface MeetingAIContextValue {
  state: typeof INITIAL_ENGINE_STATE;
  service: MeetingAIService;
  runFullFlow: (meetingId: string) => Promise<void>;
  reset: () => void;
  setProvider: (name: MeetingAIProviderName) => void;
}

const MeetingAIContext = createContext<MeetingAIContextValue | null>(null);

interface MeetingAIProviderProps {
  children: ReactNode;
  defaultProvider?: MeetingAIProviderName;
}

export function MeetingAIProvider({ children, defaultProvider = "mock" }: MeetingAIProviderProps) {
  const [engineState, dispatch] = useReducer(meetingAIReducer, {
    ...INITIAL_ENGINE_STATE,
    providerName: defaultProvider,
  });

  const service = useMemo(
    () => MeetingAIService.create(engineState.providerName),
    [engineState.providerName]
  );

  const runFullFlow = useCallback(
    async (meetingId: string) => {
      const flow = MeetingAIFlowService.create(engineState.providerName, dispatch);
      await flow.runFullFlow(meetingId);
    },
    [engineState.providerName]
  );

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const setProvider = useCallback(
    (name: MeetingAIProviderName) => dispatch({ type: "PATCH", payload: { providerName: name } }),
    []
  );

  const value = useMemo(
    () => ({ state: engineState, service, runFullFlow, reset, setProvider }),
    [engineState, service, runFullFlow, reset, setProvider]
  );

  return <MeetingAIContext.Provider value={value}>{children}</MeetingAIContext.Provider>;
}

export function useMeetingAIContext() {
  const ctx = useContext(MeetingAIContext);
  if (!ctx) throw new Error("useMeetingAIContext deve ser usado dentro de MeetingAIProvider");
  return ctx;
}

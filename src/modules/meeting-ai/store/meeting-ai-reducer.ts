import type { MeetingAIEngineState, MeetingFlowStep } from "@/modules/meeting-ai/types";
import { INITIAL_ENGINE_STATE } from "@/modules/meeting-ai/types";
import { getProgressForStep, mapFlowStepToState } from "@/modules/meeting-ai/utils/progress";

export type MeetingAIAction =
  | { type: "RESET" }
  | { type: "SET_MEETING_ID"; meetingId: string }
  | { type: "SET_FLOW_STEP"; step: MeetingFlowStep }
  | { type: "SET_RUNNING"; isRunning: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "PATCH"; payload: Partial<MeetingAIEngineState> };

export function meetingAIReducer(state: MeetingAIEngineState, action: MeetingAIAction): MeetingAIEngineState {
  switch (action.type) {
    case "RESET":
      return { ...INITIAL_ENGINE_STATE };
    case "SET_MEETING_ID":
      return { ...state, meetingId: action.meetingId };
    case "SET_FLOW_STEP":
      return {
        ...state,
        flowStep: action.step,
        state: mapFlowStepToState(action.step),
        progress: getProgressForStep(action.step),
      };
    case "SET_RUNNING":
      return { ...state, isRunning: action.isRunning };
    case "SET_ERROR":
      return { ...state, state: "error", error: action.error, isRunning: false };
    case "PATCH":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

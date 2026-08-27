import { FLOW_STEP_LABELS, STATE_LABELS } from "@/modules/meeting-ai/utils/progress";
import { useMeetingAIContext } from "@/modules/meeting-ai/providers/MeetingAIProvider";

export function useMeetingProgress() {
  const { state } = useMeetingAIContext();
  return {
    progress: state.progress,
    flowStep: state.flowStep,
    flowStepLabel: FLOW_STEP_LABELS[state.flowStep],
    stateLabel: STATE_LABELS[state.state],
    isRunning: state.isRunning,
    isFinished: state.state === "finished",
    isError: state.state === "error",
    error: state.error,
  };
}

import { useMeetingAIContext } from "@/modules/meeting-ai/providers/MeetingAIProvider";

export function useMeetingFlow() {
  const { state, runFullFlow, reset } = useMeetingAIContext();
  return {
    runFullFlow,
    reset,
    meetingId: state.meetingId,
    isRunning: state.isRunning,
    isFinished: state.state === "finished",
  };
}

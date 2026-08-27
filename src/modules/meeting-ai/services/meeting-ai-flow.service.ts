import type { MeetingAudio, MeetingAIProviderName } from "@/modules/meeting-ai/types";
import { getMeetingAIProvider } from "@/modules/meeting-ai/providers";
import type { IMeetingAIProvider } from "@/modules/meeting-ai/types/provider";
import { FLOW_STEPS } from "@/modules/meeting-ai/utils/progress";
import { countWords, mockParticipants } from "@/modules/meeting-ai/mock";
import { delay } from "@/modules/meeting-ai/utils";
import type { MeetingAIAction } from "@/modules/meeting-ai/store/meeting-ai-reducer";

type Dispatch = (action: MeetingAIAction) => void;

const STEP_DELAY_MS = 400;

export class MeetingAIFlowService {
  private audio: MeetingAudio | null = null;
  private transcript: import("@/modules/meeting-ai/types").MeetingTranscriptEntry[] = [];
  private elapsed = 0;

  constructor(
    private provider: IMeetingAIProvider,
    private dispatch: Dispatch
  ) {}

  static create(providerName: MeetingAIProviderName, dispatch: Dispatch) {
    return new MeetingAIFlowService(getMeetingAIProvider(providerName), dispatch);
  }

  async runFullFlow(meetingId: string): Promise<void> {
    this.dispatch({ type: "SET_MEETING_ID", meetingId });
    this.dispatch({ type: "SET_RUNNING", isRunning: true });
    this.dispatch({
      type: "PATCH",
      payload: { error: null, metrics: { participantCount: 0, meetingDurationMinutes: 55, elapsedSeconds: 0, wordCount: 0, transcriptSegments: 0 } },
    });

    this.elapsed = 0;
    const elapsedInterval = setInterval(() => {
      this.elapsed += 1;
      this.dispatch({
        type: "PATCH",
        payload: {
          metrics: {
            participantCount: mockParticipants.length,
            meetingDurationMinutes: 55,
            elapsedSeconds: this.elapsed,
            wordCount: countWords(this.transcript),
            transcriptSegments: this.transcript.length,
          },
        },
      });
    }, 1000);

    try {
      for (const step of FLOW_STEPS) {
        this.dispatch({ type: "SET_FLOW_STEP", step });
        await delay(STEP_DELAY_MS);
        await this.executeStep(meetingId, step);
      }
      this.dispatch({ type: "SET_RUNNING", isRunning: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido no fluxo";
      this.dispatch({ type: "SET_ERROR", error: message });
    } finally {
      clearInterval(elapsedInterval);
    }
  }

  private async executeStep(meetingId: string, step: (typeof FLOW_STEPS)[number]) {
    switch (step) {
      case "preparing-meeting": {
        const result = await this.provider.startMeeting(meetingId);
        if (!result.success || !result.data) throw new Error(result.error ?? "Falha ao iniciar reunião");
        this.dispatch({ type: "PATCH", payload: { session: result.data } });
        break;
      }
      case "starting-recording": {
        const result = await this.provider.startRecording(meetingId);
        if (!result.success || !result.data) throw new Error(result.error ?? "Falha ao iniciar gravação");
        this.audio = result.data;
        this.dispatch({ type: "PATCH", payload: { audio: result.data } });
        break;
      }
      case "ending-meeting": {
        const stopRec = await this.provider.stopRecording(meetingId);
        if (!stopRec.success || !stopRec.data) throw new Error(stopRec.error ?? "Falha ao parar gravação");
        this.audio = stopRec.data;
        await this.provider.stopMeeting(meetingId);
        this.dispatch({ type: "PATCH", payload: { audio: stopRec.data } });
        break;
      }
      case "uploading-audio": {
        if (!this.audio) throw new Error("Áudio não disponível");
        const result = await this.provider.uploadAudio(meetingId, this.audio);
        if (!result.success || !result.data) throw new Error(result.error ?? "Falha no upload");
        this.audio = result.data;
        this.dispatch({ type: "PATCH", payload: { audio: result.data } });
        break;
      }
      case "transcribing": {
        if (!this.audio) throw new Error("Áudio não disponível");
        const result = await this.provider.transcribe(meetingId, this.audio);
        if (!result.success || !result.data) throw new Error(result.error ?? "Falha na transcrição");
        this.transcript = result.data;
        this.dispatch({
          type: "PATCH",
          payload: {
            transcript: result.data,
            metrics: {
              participantCount: mockParticipants.length,
              meetingDurationMinutes: 55,
              elapsedSeconds: this.elapsed,
              wordCount: countWords(result.data),
              transcriptSegments: result.data.length,
            },
          },
        });
        break;
      }
      case "analyzing": {
        const [timelineResult, insightsResult, decisionsResult] = await Promise.all([
          this.provider.generateTimeline(meetingId, this.transcript),
          this.provider.generateInsights(meetingId, this.transcript),
          this.provider.generateDecisions(meetingId, this.transcript),
        ]);
        this.dispatch({
          type: "PATCH",
          payload: {
            timeline: timelineResult.data ?? [],
            insights: insightsResult.data ?? [],
            decisions: decisionsResult.data ?? [],
          },
        });
        break;
      }
      case "generating-briefing": {
        const result = await this.provider.generateBriefing(meetingId, this.transcript);
        if (!result.success || !result.data) throw new Error(result.error ?? "Falha ao gerar briefing");
        this.dispatch({ type: "PATCH", payload: { briefing: result.data } });
        break;
      }
      case "generating-tasks": {
        const result = await this.provider.generateTasks(meetingId, this.transcript);
        if (!result.success || !result.data) throw new Error(result.error ?? "Falha ao gerar tarefas");
        this.dispatch({ type: "PATCH", payload: { tasks: result.data } });
        break;
      }
      case "generating-summary": {
        const result = await this.provider.generateSummary(meetingId, this.transcript);
        if (!result.success || !result.data) throw new Error(result.error ?? "Falha ao gerar resumo");
        this.dispatch({ type: "PATCH", payload: { summary: result.data } });
        break;
      }
      default:
        break;
    }
  }
}

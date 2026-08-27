"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useMeetingAIContext } from "@/modules/meeting-ai/providers/MeetingAIProvider";
import { useMeetingProgress } from "@/modules/meeting-ai/hooks/use-meeting-progress";
import { MeetingAIStatus } from "@/modules/meeting-ai/components/MeetingAIStatus";
import { MeetingProgress } from "@/modules/meeting-ai/components/MeetingProgress";
import { MeetingMetricsView } from "@/modules/meeting-ai/components/MeetingMetrics";
import { MeetingStateVisual } from "@/modules/meeting-ai/components/states";
import { MeetingRecorder } from "@/modules/meeting-ai/components/MeetingRecorder";
import { MeetingUploader } from "@/modules/meeting-ai/components/MeetingUploader";
import { MeetingTimeline } from "@/modules/meeting-ai/components/MeetingTimeline";
import { MeetingSummary } from "@/modules/meeting-ai/components/MeetingSummary";
import { MeetingBriefingView } from "@/modules/meeting-ai/components/MeetingBriefing";
import { MeetingTasks } from "@/modules/meeting-ai/components/MeetingTasks";
import { MeetingDecisions } from "@/modules/meeting-ai/components/MeetingDecisions";
import { MeetingInsights } from "@/modules/meeting-ai/components/MeetingInsights";
import { MeetingParticipants } from "@/modules/meeting-ai/components/MeetingParticipants";
import { MeetingTranscription } from "@/modules/meeting-ai/components/MeetingTranscription";
import { Button } from "@/components/ui/button-shadcn";

interface MeetingProcessingProps {
  meetingId: string;
  meetingTitle?: string;
  backHref?: string;
}

export function MeetingProcessing({
  meetingId,
  meetingTitle = "Reunião",
  backHref,
}: MeetingProcessingProps) {
  const { state, runFullFlow, reset } = useMeetingAIContext();
  const { flowStepLabel, progress, isFinished, isError } = useMeetingProgress();

  const backLink = backHref ?? `/reunioes/${meetingId}`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          href={backLink}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-foreground/70" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Meeting AI Engine</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{meetingTitle}</p>
            </div>
          </div>
          <MeetingAIStatus state={state.state} />
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface/40 p-5 sm:p-8 space-y-6">
        <MeetingProgress label={flowStepLabel} progress={progress} />
        <MeetingMetricsView metrics={state.metrics} />
        <MeetingStateVisual state={state.state} error={state.error} />

        {state.state === "idle" && !state.isRunning && (
          <div className="flex justify-center pt-2">
            <Button onClick={() => runFullFlow(meetingId)} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Iniciar processamento
            </Button>
          </div>
        )}

        {(isFinished || isError) && (
          <div className="flex justify-center gap-2 pt-2">
            <Button variant="outline" onClick={reset} className="border-border-subtle">
              Reiniciar
            </Button>
            {isFinished && (
              <Button asChild>
                <Link href={backLink}>Ver reunião</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {(state.state === "recording" || state.audio) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MeetingRecorder audio={state.audio} isRecording={state.state === "recording"} />
          <MeetingUploader
            audio={state.audio}
            isUploading={state.state === "uploading"}
          />
        </div>
      )}

      {isFinished && (
        <div className="space-y-4">
          <MeetingSummary summary={state.summary} />
          <MeetingBriefingView briefing={state.briefing} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MeetingTranscription transcript={state.transcript} />
            <MeetingTimeline events={state.timeline} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MeetingDecisions decisions={state.decisions} />
            <MeetingInsights insights={state.insights} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MeetingTasks tasks={state.tasks} />
            <MeetingParticipants participants={state.session?.participants ?? []} />
          </div>
        </div>
      )}
    </div>
  );
}

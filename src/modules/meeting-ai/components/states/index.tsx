import type { MeetingAIState } from "@/modules/meeting-ai/types";
import { MeetingLoader } from "@/modules/meeting-ai/components/MeetingLoader";
import { MeetingRecorder } from "@/modules/meeting-ai/components/MeetingRecorder";
import { MeetingUploader } from "@/modules/meeting-ai/components/MeetingUploader";
import { Mic, Upload, FileText, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StateVisualProps {
  className?: string;
}

export function IdleState({ className }: StateVisualProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      <p className="text-xs text-muted-foreground">Pronto para iniciar o processamento</p>
    </div>
  );
}

export function PreparingState({ className }: StateVisualProps) {
  return <MeetingLoader label="Preparando reunião..." className={className} />;
}

export function RecordingState({ className }: StateVisualProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
      <Mic className="h-5 w-5 text-foreground/60 animate-pulse" />
      <span className="text-xs text-muted-foreground">Gravando reunião...</span>
    </div>
  );
}

export function UploadingState({ className }: StateVisualProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
      <Upload className="h-5 w-5 text-foreground/60 animate-pulse" />
      <span className="text-xs text-muted-foreground">Enviando áudio...</span>
    </div>
  );
}

export function TranscribingState({ className }: StateVisualProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
      <FileText className="h-5 w-5 text-foreground/60 animate-pulse" />
      <span className="text-xs text-muted-foreground">Transcrevendo áudio...</span>
    </div>
  );
}

export function AnalyzingState({ className }: StateVisualProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
      <Sparkles className="h-5 w-5 text-foreground/60 animate-pulse" />
      <span className="text-xs text-muted-foreground">Analisando conteúdo...</span>
    </div>
  );
}

export function GeneratingBriefingState({ className }: StateVisualProps) {
  return <MeetingLoader label="Gerando briefing e artefatos..." className={className} />;
}

export function FinishedState({ className }: StateVisualProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
      <CheckCircle2 className="h-5 w-5 text-foreground/70" />
      <span className="text-xs text-foreground">Processamento concluído</span>
    </div>
  );
}

export function ErrorState({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
      <AlertCircle className="h-5 w-5 text-state-red" />
      <span className="text-xs text-state-red">{message}</span>
    </div>
  );
}

export function MeetingStateVisual({ state, error }: { state: MeetingAIState; error: string | null }) {
  switch (state) {
    case "idle":
      return <IdleState />;
    case "preparing":
      return <PreparingState />;
    case "recording":
      return <RecordingState />;
    case "uploading":
      return <UploadingState />;
    case "transcribing":
      return <TranscribingState />;
    case "analyzing":
      return <AnalyzingState />;
    case "generating-briefing":
      return <GeneratingBriefingState />;
    case "finished":
      return <FinishedState />;
    case "error":
      return <ErrorState message={error ?? "Erro no processamento"} />;
    default:
      return null;
  }
}

export { MeetingRecorder, MeetingUploader };

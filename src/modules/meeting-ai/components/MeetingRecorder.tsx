import { Mic, MicOff, Circle } from "lucide-react";
import type { MeetingAudio } from "@/modules/meeting-ai/types";
import { formatDuration, formatFileSize } from "@/modules/meeting-ai/utils";
import { cn } from "@/lib/utils";

interface MeetingRecorderProps {
  audio: MeetingAudio | null;
  isRecording?: boolean;
  className?: string;
}

export function MeetingRecorder({ audio, isRecording, className }: MeetingRecorderProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4", className)}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-xs font-medium text-foreground">Gravador</h3>
        {isRecording && (
          <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Circle className="h-2 w-2 fill-state-red text-state-red animate-pulse" />
            Gravando
          </span>
        )}
      </div>
      <div className="flex items-center justify-center h-20 rounded-lg bg-surface-inset border border-border-subtle mb-3">
        {isRecording ? (
          <Mic className="h-8 w-8 text-foreground/60" />
        ) : (
          <MicOff className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>
      {audio && (
        <dl className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <dt className="text-muted-foreground">Duração</dt>
            <dd className="text-foreground tabular-nums">{formatDuration(audio.duration)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tamanho</dt>
            <dd className="text-foreground">{formatFileSize(audio.size)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Formato</dt>
            <dd className="text-foreground uppercase">{audio.format}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Idioma</dt>
            <dd className="text-foreground">{audio.language}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

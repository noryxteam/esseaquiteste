import type { MeetingTranscriptEntry } from "@/modules/meeting-ai/types";
import { cn } from "@/lib/utils";

interface MeetingTranscriptionProps {
  transcript: MeetingTranscriptEntry[];
  className?: string;
}

export function MeetingTranscription({ transcript, className }: MeetingTranscriptionProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-border-subtle">
        <h3 className="text-xs font-medium text-foreground">Transcrição</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">{transcript.length} segmentos</p>
      </div>
      <div className="max-h-[320px] overflow-y-auto divide-y divide-border-subtle">
        {transcript.map((entry) => (
          <div key={entry.id} className="px-4 py-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[10px] tabular-nums text-muted-foreground">{entry.startTime}</span>
              <span className="text-[11px] font-medium text-foreground">
                {entry.speaker}
                {entry.speakerRole && <span className="text-muted-foreground font-normal"> ({entry.speakerRole})</span>}
              </span>
              <span className="text-[9px] text-muted-foreground/60 ml-auto tabular-nums">
                {Math.round(entry.confidence * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

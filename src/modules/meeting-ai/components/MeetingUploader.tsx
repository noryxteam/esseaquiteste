import { Upload, CheckCircle2 } from "lucide-react";
import type { MeetingAudio } from "@/modules/meeting-ai/types";
import { formatFileSize } from "@/modules/meeting-ai/utils";
import { cn } from "@/lib/utils";

interface MeetingUploaderProps {
  audio: MeetingAudio | null;
  isUploading?: boolean;
  className?: string;
}

export function MeetingUploader({ audio, isUploading, className }: MeetingUploaderProps) {
  const uploaded = audio?.status === "uploaded" || audio?.status === "processed";

  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Upload className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-medium text-foreground">Upload de áudio</h3>
      </div>
      <div className="flex items-center justify-center h-16 rounded-lg border border-dashed border-border-subtle bg-surface-inset mb-3">
        {uploaded ? (
          <CheckCircle2 className="h-6 w-6 text-foreground/60" />
        ) : (
          <Upload className={cn("h-6 w-6", isUploading ? "text-foreground/60 animate-pulse" : "text-muted-foreground/40")} />
        )}
      </div>
      {audio && (
        <p className="text-[10px] text-muted-foreground text-center">
          {uploaded ? "Áudio enviado" : isUploading ? "Enviando..." : "Aguardando envio"} · {formatFileSize(audio.size)}
        </p>
      )}
    </div>
  );
}

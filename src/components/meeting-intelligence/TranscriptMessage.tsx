import type { TranscriptMessage } from "@/lib/mock-data/meeting-intelligence-types";

interface TranscriptMessageProps {
  message: TranscriptMessage;
}

export function TranscriptMessageItem({ message }: TranscriptMessageProps) {
  return (
    <div className="py-3 border-b border-border-subtle last:border-0">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[10px] tabular-nums text-muted-foreground/80">{message.timestamp}</span>
        <span className="text-[11px] font-medium text-foreground">
          {message.speakerName}
          <span className="text-muted-foreground font-normal"> ({message.speakerCompany})</span>
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-0 sm:pl-[52px]">{message.message}</p>
    </div>
  );
}

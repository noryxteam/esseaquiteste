import type { MeetingParticipant } from "@/modules/meeting-ai/types";
import { cn } from "@/lib/utils";

interface MeetingParticipantsProps {
  participants: MeetingParticipant[];
  className?: string;
}

export function MeetingParticipants({ participants, className }: MeetingParticipantsProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4", className)}>
      <h3 className="text-xs font-medium text-foreground mb-3">Participantes</h3>
      <ul className="space-y-2.5">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-medium shrink-0">
              {p.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-foreground truncate">
                {p.name}
                {p.isHost && <span className="text-muted-foreground font-normal"> · Host</span>}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {p.role} · {p.company}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

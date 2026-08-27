import type { MeetingAIState } from "@/modules/meeting-ai/types";
import { STATE_LABELS } from "@/modules/meeting-ai/utils/progress";
import { cn } from "@/lib/utils";

interface MeetingAIStatusProps {
  state: MeetingAIState;
  className?: string;
}

export function MeetingAIStatus({ state, className }: MeetingAIStatusProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border-subtle bg-surface-elevated px-2.5 py-1 text-[10px] font-medium text-muted-foreground",
        state === "finished" && "text-foreground",
        state === "error" && "border-state-red/30 text-state-red",
        className
      )}
    >
      {STATE_LABELS[state]}
    </span>
  );
}

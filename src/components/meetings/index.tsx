import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/avatars";
import { StatusBadge } from "@/components/badges";
import { BaseCard } from "@/components/common/BaseCard";

export interface MeetingParticipantData {
  id: string;
  name: string;
  initials: string;
  role?: string;
  company?: string;
}

interface MeetingParticipantProps {
  participant: MeetingParticipantData;
  className?: string;
}

export function MeetingParticipant({ participant, className }: MeetingParticipantProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Avatar initials={participant.initials} name={participant.name} size="md" />
      <div className="min-w-0">
        <p className="text-xs text-foreground truncate">{participant.name}</p>
        {(participant.role || participant.company) && (
          <p className="text-[10px] text-muted-foreground truncate">
            {[participant.role, participant.company].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}

export { Timeline as MeetingTimeline, TimelineCard as MeetingTimelineCard } from "@/components/timeline";

interface MeetingSummaryProps {
  summary: string;
  className?: string;
}

export function MeetingSummary({ summary, className }: MeetingSummaryProps) {
  return (
    <BaseCard className={className} header={<h3 className="text-sm font-medium text-foreground">Resumo</h3>}>
      <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
    </BaseCard>
  );
}

interface MeetingTaskProps {
  title: string;
  assignee?: string;
  dueDate?: string;
  completed?: boolean;
  className?: string;
}

export function MeetingTask({ title, assignee, dueDate, completed, className }: MeetingTaskProps) {
  return (
    <div className={cn("flex items-start gap-2.5 py-2", className)}>
      {completed ? (
        <Check className="h-3.5 w-3.5 text-foreground/60 shrink-0 mt-0.5" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("text-xs", completed ? "text-muted-foreground line-through" : "text-foreground")}>{title}</p>
        {(assignee || dueDate) && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {[assignee, dueDate].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}

interface MeetingDecisionProps {
  title: string;
  description?: string;
  className?: string;
}

export function MeetingDecision({ title, description, className }: MeetingDecisionProps) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <Check className="h-3.5 w-3.5 text-foreground/60 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-foreground">{title}</p>
        {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

export type MeetingLifecycleStatus = "agendada" | "em-andamento" | "concluida" | "cancelada";

const MEETING_STATUS: Record<MeetingLifecycleStatus, { label: string; status: import("@/components/common/types").EntityStatus }> = {
  agendada: { label: "Agendada", status: "pending" },
  "em-andamento": { label: "Em andamento", status: "active" },
  concluida: { label: "Concluída", status: "completed" },
  cancelada: { label: "Cancelada", status: "cancelled" },
};

export function MeetingStatus({ status, className }: { status: MeetingLifecycleStatus; className?: string }) {
  const config = MEETING_STATUS[status];
  return <StatusBadge status={config.status} label={config.label} className={className} />;
}

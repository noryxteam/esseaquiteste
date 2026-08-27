import type { NextStepItem } from "@/lib/mock-data/meeting-intelligence-types";
import { ParticipantAvatar } from "@/components/meeting-intelligence/ParticipantAvatar";

interface AINextStepsProps {
  nextSteps: NextStepItem[];
}

export function AINextSteps({ nextSteps }: AINextStepsProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 h-full">
      <h3 className="text-xs font-medium text-foreground mb-3">Próximos passos</h3>
      <ul className="space-y-3">
        {nextSteps.map((step) => (
          <li key={step.id} className="flex items-start justify-between gap-3">
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 min-w-0">{step.description}</p>
            <div className="flex items-center gap-2 shrink-0">
              <ParticipantAvatar initials={step.assigneeInitials} name={step.assignee} size="sm" />
              <span className="text-[10px] text-muted-foreground hidden sm:inline">{step.assignee.split(" ")[0]}</span>
              <span className="text-[10px] tabular-nums text-muted-foreground/80">{step.dueDate}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

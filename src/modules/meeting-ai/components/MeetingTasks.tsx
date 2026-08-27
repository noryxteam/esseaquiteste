import type { MeetingTask } from "@/modules/meeting-ai/types";
import { cn } from "@/lib/utils";

interface MeetingTasksProps {
  tasks: MeetingTask[];
  className?: string;
}

const PRIORITY_LABEL: Record<MeetingTask["priority"], string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export function MeetingTasks({ tasks, className }: MeetingTasksProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-border-subtle">
        <h3 className="text-xs font-medium text-foreground">Tarefas geradas</h3>
      </div>
      <ul className="divide-y divide-border-subtle">
        {tasks.map((task) => (
          <li key={task.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">{task.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{task.description}</p>
              </div>
              <span className="text-[9px] text-muted-foreground shrink-0">{PRIORITY_LABEL[task.priority]}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span>{task.responsible}</span>
              <span>·</span>
              <span className="tabular-nums">{task.deadline}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

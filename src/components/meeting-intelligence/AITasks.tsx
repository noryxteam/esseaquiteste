"use client";

import type { GeneratedTask } from "@/lib/mock-data/meeting-intelligence-types";
import { ParticipantAvatar } from "@/components/meeting-intelligence/ParticipantAvatar";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface AITasksProps {
  tasks: GeneratedTask[];
  onToggle?: (taskId: string) => void;
}

export function AITasks({ tasks, onToggle }: AITasksProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">Tasks geradas pela IA</h2>
          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-md bg-surface-elevated border border-border-subtle text-[10px] text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground hover:text-foreground">
          Ver todas
        </Button>
      </div>

      <ul className="divide-y divide-border-subtle">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => onToggle?.(task.id)}
              className={cn(
                "mt-0.5 h-3.5 w-3.5 rounded border shrink-0 flex items-center justify-center transition-colors",
                task.completed
                  ? "bg-foreground border-foreground"
                  : "border-border-strong hover:border-foreground/40"
              )}
              aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
            >
              {task.completed && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-accent-foreground" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-xs leading-snug",
                  task.completed ? "text-muted-foreground line-through" : "text-foreground/90"
                )}
              >
                {task.description}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <ParticipantAvatar initials={task.assigneeInitials} name={task.assignee} size="sm" />
                <span className="text-[10px] text-muted-foreground">{task.assignee.split(" ")[0]}</span>
                <span className="text-[10px] tabular-nums text-muted-foreground/70">{task.dueDate}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

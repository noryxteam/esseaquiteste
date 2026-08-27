import { CheckSquare } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { EmptyStateProps } from "./EmptyState";

export interface EmptyTasksProps extends Omit<EmptyStateProps, "icon" | "title" | "description"> {
  title?: string;
  description?: string;
}

export function EmptyTasks({
  title = "Nenhuma tarefa pendente",
  description = "Crie tarefas para organizar entregas e acompanhar o progresso da equipe.",
  actionLabel = "Nova tarefa",
  ...props
}: EmptyTasksProps) {
  return (
    <EmptyState
      icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      {...props}
    />
  );
}

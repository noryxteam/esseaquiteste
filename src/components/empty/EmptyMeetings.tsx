import { Calendar } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { EmptyStateProps } from "./EmptyState";

export interface EmptyMeetingsProps extends Omit<EmptyStateProps, "icon" | "title" | "description"> {
  title?: string;
  description?: string;
}

export function EmptyMeetings({
  title = "Nenhuma reunião agendada",
  description = "Agende reuniões para acompanhar alinhamentos com clientes e equipe.",
  actionLabel = "Agendar reunião",
  ...props
}: EmptyMeetingsProps) {
  return (
    <EmptyState
      icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      {...props}
    />
  );
}

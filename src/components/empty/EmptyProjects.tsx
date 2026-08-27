import { FolderKanban } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { EmptyStateProps } from "./EmptyState";

export interface EmptyProjectsProps extends Omit<EmptyStateProps, "icon" | "title" | "description"> {
  title?: string;
  description?: string;
}

export function EmptyProjects({
  title = "Nenhum projeto encontrado",
  description = "Crie um projeto para acompanhar entregas, prazos e equipe.",
  actionLabel = "Criar projeto",
  ...props
}: EmptyProjectsProps) {
  return (
    <EmptyState
      icon={<FolderKanban className="h-4 w-4 text-muted-foreground" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      {...props}
    />
  );
}

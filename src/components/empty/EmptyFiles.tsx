import { File } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { EmptyStateProps } from "./EmptyState";

export interface EmptyFilesProps extends Omit<EmptyStateProps, "icon" | "title" | "description"> {
  title?: string;
  description?: string;
}

export function EmptyFiles({
  title = "Nenhum arquivo encontrado",
  description = "Envie documentos, propostas e materiais para manter tudo organizado.",
  actionLabel = "Enviar arquivo",
  ...props
}: EmptyFilesProps) {
  return (
    <EmptyState
      icon={<File className="h-4 w-4 text-muted-foreground" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      {...props}
    />
  );
}

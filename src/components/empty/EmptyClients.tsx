import { Building2 } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { EmptyStateProps } from "./EmptyState";

export interface EmptyClientsProps extends Omit<EmptyStateProps, "icon" | "title" | "description"> {
  title?: string;
  description?: string;
}

export function EmptyClients({
  title = "Nenhum cliente encontrado",
  description = "Adicione seu primeiro cliente para começar a gerenciar projetos e contratos.",
  actionLabel = "Adicionar cliente",
  ...props
}: EmptyClientsProps) {
  return (
    <EmptyState
      icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      {...props}
    />
  );
}

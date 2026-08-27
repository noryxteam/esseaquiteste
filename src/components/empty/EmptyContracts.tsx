import { FileSignature } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { EmptyStateProps } from "./EmptyState";

export interface EmptyContractsProps extends Omit<EmptyStateProps, "icon" | "title" | "description"> {
  title?: string;
  description?: string;
}

export function EmptyContracts({
  title = "Nenhum contrato encontrado",
  description = "Crie ou importe contratos para centralizar documentos e assinaturas.",
  actionLabel = "Novo contrato",
  ...props
}: EmptyContractsProps) {
  return (
    <EmptyState
      icon={<FileSignature className="h-4 w-4 text-muted-foreground" />}
      title={title}
      description={description}
      actionLabel={actionLabel}
      {...props}
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import type { ClientRow as ClientRowType } from "@/lib/mock-data/clientes-types";
import { Avatar } from "@/components/clientes/Avatar";
import { ActionMenu } from "@/components/ui/action-menu";
import type { ActionMenuItem } from "@/components/ui/action-menu";
import { formatCurrency } from "@/lib/utils";
import { routes } from "@/lib/app-routes";
import { useFeedback } from "@/contexts/feedback-context";
import { useAppState } from "@/contexts/app-context";
import { CLIENT_PERMANENT_DELETE_ENABLED } from "@/lib/features/client-permanent-delete";
import { deleteClienteCascade } from "@/lib/clientes/delete-cliente-cascade";

interface ClientRowProps {
  client: ClientRowType;
}

function useClientActions(client: ClientRowType): ActionMenuItem[] {
  const router = useRouter();
  const { showSuccess, showInfo } = useFeedback();
  const { invalidate } = useAppState();

  const items: ActionMenuItem[] = [
    { id: "view", label: "Ver detalhes", onClick: () => router.push(routes.cliente(client.id)) },
    { id: "edit", label: "Editar", onClick: () => showInfo(`Edição de ${client.name} em breve.`) },
    { id: "archive", label: "Arquivar", onClick: () => showInfo(`${client.name} arquivado.`) },
  ];

  // Desligar: CLIENT_PERMANENT_DELETE_ENABLED = false (flag + lógica)
  if (CLIENT_PERMANENT_DELETE_ENABLED) {
    items.push({
      id: "delete",
      label: "Excluir",
      destructive: true,
      onClick: () => {
        const ok = window.confirm(
          `Excluir permanentemente "${client.name}"?\n\nIsso apaga a ficha, contratos e todos os dados deste cliente. Não dá para desfazer.`
        );
        if (!ok) return;
        const deleted = deleteClienteCascade(client.id);
        if (!deleted) {
          showInfo("Exclusão desativada.");
          return;
        }
        invalidate();
        showSuccess(`${client.name} excluído permanentemente.`);
      },
    });
  }

  return items;
}

export function ClientRow({ client }: ClientRowProps) {
  const items = useClientActions(client);

  return (
    <>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar initials={client.initials} />
          <span className="text-sm font-medium text-foreground">{client.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm text-foreground/90">{client.contactName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{client.email}</p>
      </td>
      <td className="px-4 py-3.5 text-sm text-muted-foreground tabular-nums">{client.projects}</td>
      <td className="px-4 py-3.5 text-sm text-foreground tabular-nums">
        {client.revenue > 0 ? formatCurrency(client.revenue) : "—"}
      </td>
      <td className="px-4 py-3.5 text-sm text-muted-foreground">{client.lastContact}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Avatar initials={client.assignee.initials} size="sm" className="rounded-full" />
          <span className="text-xs text-muted-foreground hidden xl:inline">{client.assignee.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
        <ActionMenu items={items} />
      </td>
    </>
  );
}

export function ClientRowMobile({ client }: ClientRowProps) {
  const items = useClientActions(client);

  return (
    <div className="p-4 space-y-3 hover:bg-surface-hover/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar initials={client.initials} />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{client.name}</p>
            <p className="text-xs text-muted-foreground truncate">{client.email}</p>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActionMenu items={items} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">{client.projects} projetos</span>
        <span className="text-muted-foreground">{client.revenue > 0 ? formatCurrency(client.revenue) : "—"}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{client.lastContact}</span>
        <div className="flex items-center gap-1.5">
          <Avatar initials={client.assignee.initials} size="sm" className="rounded-full" />
          {client.assignee.name}
        </div>
      </div>
    </div>
  );
}

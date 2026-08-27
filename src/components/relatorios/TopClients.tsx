import type { TopClient } from "@/lib/mock-data/relatorios-types";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface TopClientsProps {
  clients: TopClient[];
  onClientClick?: (client: TopClient) => void;
}

export function TopClients({ clients, onClientClick }: TopClientsProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5 h-full flex flex-col">
      <h2 className="text-sm font-medium text-foreground mb-4">Clientes mais ativos</h2>
      <ul className="space-y-0 flex-1">
        {clients.map((client) => (
          <li
            key={client.id}
            onClick={() => onClientClick?.(client)}
            className={cn(
              "flex items-center gap-3 py-2.5 border-b border-border-subtle last:border-0",
              onClientClick && "cursor-pointer hover:bg-surface-hover/40 transition-colors rounded-md px-1 -mx-1"
            )}
          >
            <span className="text-xs font-medium text-muted-foreground tabular-nums w-4 shrink-0">
              {client.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{client.name}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {client.projects} projetos · {client.lastProject}
              </p>
            </div>
            <span className="text-xs font-medium text-foreground tabular-nums shrink-0">
              {client.revenue}
            </span>
          </li>
        ))}
      </ul>
      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground hover:text-foreground px-0 mt-3">
        Ver todos os clientes →
      </Button>
    </div>
  );
}

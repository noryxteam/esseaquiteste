"use client";

import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ClientRow as ClientRowType } from "@/lib/mock-data/clientes-types";
import { ClientRow, ClientRowMobile } from "@/components/clientes/ClientRow";
import { NovoClienteButton } from "@/components/clientes/SearchBar";
import { Button } from "@/components/ui/button-shadcn";
import { usePagination } from "@/hooks/use-pagination";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface ClientTableProps {
  clients: ClientRowType[];
  total: number;
  view?: "list" | "grid";
}

function ClientsEmptyState({ noClientsRegistered }: { noClientsRegistered: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <Users className="h-10 w-10 text-muted-foreground stroke-[1.25]" aria-hidden />
      <p className="mt-4 text-sm font-medium text-foreground">
        {noClientsRegistered ? "Nenhum cliente cadastrado" : "Nenhum cliente encontrado"}
      </p>
      <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
        {noClientsRegistered
          ? "Cadastre seu primeiro cliente para começar a gerenciar projetos, contratos e reuniões."
          : "Tente ajustar a busca ou os filtros para ver outros resultados."}
      </p>
      {noClientsRegistered ? (
        <div className="mt-5">
          <NovoClienteButton />
        </div>
      ) : null}
    </div>
  );
}

export function ClientTable({ clients, total, view = "list" }: ClientTableProps) {
  const router = useRouter();
  const { page, totalPages, paginated, goTo, next, prev, from, to } = usePagination(clients, 7);

  const navigate = (id: string) => router.push(routes.cliente(id));
  const isEmpty = clients.length === 0;

  const shellClass = cn(
    "rounded-lg border border-border bg-surface overflow-hidden flex flex-col",
    // Mobile: altura automática (mínimo só para o empty state respirar)
    "min-h-[320px]",
    // Tablet: altura fixa reduzida
    "md:min-h-[420px] md:h-[420px]",
    // Notebook
    "lg:min-h-[480px] lg:h-[480px]",
    // Desktop xl+: preenche o restante da coluna até o fim do aside
    "xl:min-h-0 xl:h-auto xl:flex-1"
  );

  const pagination = (
    <PaginationFooter
      from={isEmpty ? 0 : from}
      to={isEmpty ? 0 : to}
      total={total}
      page={page}
      totalPages={totalPages}
      goTo={goTo}
      next={next}
      prev={prev}
    />
  );

  if (isEmpty) {
    return (
      <div className={shellClass}>
        <ClientsEmptyState noClientsRegistered={total === 0} />
        {pagination}
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div className={shellClass}>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle">
            {paginated.map((client) => (
              <div
                key={client.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(client.id)}
                onKeyDown={(e) => e.key === "Enter" && navigate(client.id)}
                className="bg-surface p-4 hover:bg-surface-hover/50 transition-colors cursor-pointer"
              >
                <ClientRowMobile client={client} />
              </div>
            ))}
          </div>
        </div>
        {pagination}
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <div className="hidden lg:flex lg:flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="border-b border-border-subtle text-left">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Contato</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Projetos</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Receita ativa</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Último contato</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Responsável</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => navigate(client.id)}
                  className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/50 transition-colors cursor-pointer"
                >
                  <ClientRow client={client} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden flex-1 min-h-0 overflow-y-auto divide-y divide-border-subtle">
        {paginated.map((client) => (
          <div
            key={client.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(client.id)}
            onKeyDown={(e) => e.key === "Enter" && navigate(client.id)}
            className="cursor-pointer"
          >
            <ClientRowMobile client={client} />
          </div>
        ))}
      </div>

      {pagination}
    </div>
  );
}

interface PaginationFooterProps {
  from: number;
  to: number;
  total: number;
  page: number;
  totalPages: number;
  goTo: (p: number) => void;
  next: () => void;
  prev: () => void;
}

function PaginationFooter({ from, to, total, page, totalPages, goTo, next, prev }: PaginationFooterProps) {
  const pages = Array.from({ length: Math.min(Math.max(totalPages, 1), 4) }, (_, i) => i + 1);

  return (
    <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border-subtle">
      <p className="text-xs text-muted-foreground">
        Mostrando {from} a {to} de {total} clientes
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={prev}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "ghost"}
            size="sm"
            onClick={() => goTo(p)}
            className={cn(
              "h-8 w-8 p-0",
              p === page ? "bg-foreground text-accent-foreground" : "text-muted-foreground"
            )}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={next}
          disabled={page >= totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

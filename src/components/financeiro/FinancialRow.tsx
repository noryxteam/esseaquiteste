"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  RefreshCw,
  ArrowLeftRight,
} from "lucide-react";
import type { FinancialMovement } from "@/lib/mock-data/financeiro-types";
import { FinancialStatus } from "@/components/financeiro/FinancialStatus";
import { ActionMenu } from "@/components/ui/action-menu";
import { AppDrawer } from "@/components/ui/app-drawer";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface FinancialRowProps {
  movement: FinancialMovement;
}

function MovementIcon({ movement }: { movement: FinancialMovement }) {
  if (movement.tipo === "transferencia") {
    return <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />;
  }
  if (movement.tipo === "reembolso") {
    return <RefreshCw className="h-3.5 w-3.5 text-state-red" />;
  }
  if (movement.tipo === "a-receber" || movement.status === "pendente" || movement.status === "atrasado") {
    return <Clock className="h-3.5 w-3.5 text-state-orange" />;
  }
  if (movement.valor < 0) {
    return <ArrowUpRight className="h-3.5 w-3.5 text-state-red" />;
  }
  return <ArrowDownLeft className="h-3.5 w-3.5 text-state-green" />;
}

export function FinancialRow({ movement }: FinancialRowProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { showInfo } = useFeedback();
  const isNegative = movement.valor < 0;

  const openDrawer = () => setDrawerOpen(true);

  return (
    <>
      <tr
        onClick={openDrawer}
        className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/40 transition-colors group cursor-pointer"
      >
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-surface-inset border border-border-subtle flex items-center justify-center shrink-0">
              <MovementIcon movement={movement} />
            </div>
            <div>
              <p className="text-xs text-foreground tabular-nums">{movement.data}</p>
              <p className="text-[10px] text-muted-foreground tabular-nums">{movement.hora}</p>
            </div>
          </div>
        </td>

        <td className="px-4 py-3 min-w-[140px]">
          <p className="text-xs font-medium text-foreground">{movement.descricao}</p>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
            Contrato {movement.contratoNumero}
          </p>
          {movement.observacoes && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 truncate max-w-[180px]">
              {movement.observacoes}
            </p>
          )}
        </td>

        <td className="px-4 py-3 min-w-[140px]">
          <p className="text-xs text-foreground truncate">{movement.cliente}</p>
          <p className="text-[10px] text-muted-foreground truncate">Projeto: {movement.projeto}</p>
        </td>

        <td className="px-4 py-3 hidden md:table-cell">
          <span
            className={cn(
              "inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium capitalize",
              movement.categoria === "receita" && "bg-state-green/10 text-state-green",
              movement.categoria === "despesa" && "bg-state-red/10 text-state-red",
              movement.categoria === "transferencia" && "bg-white/10 text-muted-foreground"
            )}
          >
            {movement.categoria === "receita"
              ? "Receita"
              : movement.categoria === "despesa"
                ? "Despesa"
                : "Transferência"}
          </span>
        </td>

        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-xs text-muted-foreground">{movement.formaPagamento}</span>
        </td>

        <td className="px-4 py-3 whitespace-nowrap">
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              isNegative ? "text-state-red" : "text-state-green"
            )}
          >
            {movement.valorFormatted}
          </span>
        </td>

        <td className="px-4 py-3">
          <FinancialStatus status={movement.status} label={movement.statusLabel} />
        </td>

        <td className="px-4 py-3 w-10">
          <ActionMenu
            icon="horizontal"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            items={[
              { id: "view", label: "Ver detalhes", onClick: openDrawer },
              {
                id: "contract",
                label: "Ver contrato",
                onClick: () => router.push(routes.contrato(movement.contratoId)),
              },
              { id: "edit", label: "Editar", onClick: () => showInfo("Edição em breve.") },
              {
                id: "delete",
                label: "Excluir",
                destructive: true,
                onClick: () => showInfo("Exclusão em breve."),
              },
            ]}
          />
        </td>
      </tr>

      {typeof document !== "undefined" &&
        createPortal(
          <AppDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title={movement.descricao}
            subtitle={`Contrato ${movement.contratoNumero}`}
          >
            <div className="space-y-4 text-xs">
              <div className="flex justify-between gap-4 py-2 border-b border-border-subtle">
                <span className="text-muted-foreground">Cliente</span>
                <span className="text-foreground text-right">{movement.cliente}</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-border-subtle">
                <span className="text-muted-foreground">Projeto</span>
                <span className="text-foreground text-right">{movement.projeto}</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-border-subtle">
                <span className="text-muted-foreground">Valor</span>
                <span className={cn("font-medium tabular-nums", isNegative ? "text-state-red" : "text-state-green")}>
                  {movement.valorFormatted}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-border-subtle">
                <span className="text-muted-foreground">Data</span>
                <span className="text-foreground">{movement.data} · {movement.hora}</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-border-subtle">
                <span className="text-muted-foreground">Forma de pagamento</span>
                <span className="text-foreground">{movement.formaPagamento}</span>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-border-subtle">
                <span className="text-muted-foreground">Status</span>
                <FinancialStatus status={movement.status} label={movement.statusLabel} />
              </div>
              {movement.observacoes && (
                <div className="py-2">
                  <p className="text-muted-foreground mb-1">Observações</p>
                  <p className="text-foreground/80">{movement.observacoes}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  router.push(routes.contrato(movement.contratoId));
                }}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground pt-2"
              >
                Ver contrato relacionado →
              </button>
            </div>
          </AppDrawer>,
          document.body
        )}
    </>
  );
}

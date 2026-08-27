"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Contract } from "@/lib/mock-data/contratos-types";
import { ContractPreview } from "@/components/contratos/ContractPreview";
import { ContractStatusBadge } from "@/components/contratos/ContractStatus";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button-shadcn";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface ContractCardProps {
  contract: Contract;
  index?: number;
  onSelect?: (contract: Contract) => void;
}

export function ContractCard({ contract, index = 0, onSelect }: ContractCardProps) {
  const router = useRouter();
  const { showInfo, showSuccess } = useFeedback();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(contract);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative rounded-lg border border-border-subtle bg-surface/60 overflow-hidden",
        "hover:border-border hover:shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all duration-200"
      )}
    >
      <ActionMenu
        className="absolute top-[calc(3rem+0.75rem)] right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        items={[
          { id: "view", label: "Visualizar", onClick: () => onSelect?.(contract) },
          {
            id: "edit",
            label: "Editar",
            onClick: () => router.push(routes.contratoEditar(contract.id)),
          },
          {
            id: "duplicate",
            label: "Duplicar",
            onClick: () => showSuccess("Contrato duplicado."),
          },
          {
            id: "archive",
            label: "Arquivar",
            destructive: true,
            onClick: () => showInfo("Contrato arquivado."),
          },
        ]}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(contract)}
        onKeyDown={handleKeyDown}
        className="cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border"
      >
        <div className="p-3 pb-0">
          <ContractPreview
            title={contract.title}
            client={contract.client}
            number={contract.number}
          />
        </div>

        <div className="p-4 space-y-3">
          <div className="min-w-0 pr-6">
            <p className="text-[11px] text-muted-foreground truncate">{contract.client}</p>
            <p className="text-sm font-medium text-foreground mt-0.5 truncate">{contract.title}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">{contract.number}</p>
          </div>

          <ContractStatusBadge status={contract.status} label={contract.statusLabel} />

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="text-muted-foreground">Criação</p>
              <p className="text-foreground/80 mt-0.5 tabular-nums">{contract.createdAt}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Envio</p>
              <p className="text-foreground/80 mt-0.5 tabular-nums">{contract.sentAt ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-subtle">
            <div>
              <p className="text-[10px] text-muted-foreground">Valor</p>
              <p className="text-sm font-medium text-foreground tabular-nums">{contract.valueFormatted}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[9px] font-medium">
                {contract.responsible.initials}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          onClick={() => onSelect?.(contract)}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Visualizar
        </Button>
      </div>
    </motion.div>
  );
}

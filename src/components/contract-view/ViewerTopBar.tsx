"use client";

import { Download, PenLine } from "lucide-react";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { ContractStatus } from "@/components/contract-view/ContractStatus";
import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button-shadcn";
import { NoraxLogo } from "@/components/brand/NoraxLogo";
import { formatRelativeFromBrDate } from "@/components/contract-view/viewer-utils";

interface ViewerTopBarProps {
  data: ContractDocumentData;
  isAdmin: boolean;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  onHistory: () => void;
  onClose: () => void;
  onOpenInfo?: () => void;
}

export function ViewerTopBar({
  data,
  isAdmin,
  onDownload,
  onPrint,
  onShare,
  onHistory,
  onClose,
  onOpenInfo,
}: ViewerTopBarProps) {
  const updatedLabel = formatRelativeFromBrDate(
    data.history[0]?.date ?? data.createdAt
  );

  const menuItems = [
    { id: "print", label: "Imprimir", onClick: onPrint },
    { id: "share", label: "Enviar", onClick: onShare },
    ...(isAdmin
      ? [{ id: "history", label: "Ver histórico", onClick: onHistory }]
      : []),
    { id: "close", label: "Fechar", onClick: onClose, destructive: true },
  ];

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-[64px]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <NoraxLogo invert className="h-7 w-auto shrink-0" />

          <div className="min-w-0 ml-3 sm:ml-5 pl-3 sm:pl-5 border-l border-white/[0.08]">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-[15px] font-semibold text-white tracking-tight truncate">
                {data.title || "Contrato de Prestação de Serviços"}
              </h1>
              <span className="inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-white/45 shrink-0">
                {data.number}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] text-white/40">
              <ContractStatus status={data.statusVariant} label={data.statusLabel} />
              <span className="hidden sm:inline">Criado em {data.createdAt}</span>
              <span className="hidden md:inline text-white/25">·</span>
              <span className="hidden md:inline">Última atualização {updatedLabel.toLowerCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenInfo ? (
            <Button
              type="button"
              size="sm"
              className="lg:hidden h-8 gap-1.5 bg-white text-black hover:bg-white/90 text-xs"
              onClick={onOpenInfo}
            >
              <PenLine className="h-3.5 w-3.5" />
              Assinar
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-white/[0.08] bg-transparent text-white/70 hover:text-white hover:bg-white/[0.06] text-xs"
            onClick={onDownload}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Baixar PDF</span>
          </Button>
          <ActionMenu items={menuItems} icon="horizontal" />
        </div>
      </div>
    </header>
  );
}

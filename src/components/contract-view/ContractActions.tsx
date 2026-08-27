"use client";

import {
  Download,
  Maximize2,
  Minimize2,
  Printer,
  Search,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";

interface ContractActionsProps {
  fullscreen: boolean;
  onFullscreen: () => void;
  onSearch?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
}

export function ContractActions({
  fullscreen,
  onFullscreen,
  onSearch,
  onDownload,
  onPrint,
  onShare,
}: ContractActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={onFullscreen}
      >
        {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        Tela cheia
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={onSearch}
      >
        <Search className="h-3.5 w-3.5" />
        Buscar
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={onDownload}
      >
        <Download className="h-3.5 w-3.5" />
        Baixar PDF
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={onPrint}
      >
        <Printer className="h-3.5 w-3.5" />
        Imprimir
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={onShare}
      >
        <Send className="h-3.5 w-3.5" />
        Enviar
      </Button>
    </div>
  );
}

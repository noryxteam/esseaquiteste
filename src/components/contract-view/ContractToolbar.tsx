"use client";



import { Button } from "@/components/ui/button-shadcn";

import { Input } from "@/components/ui/input-shadcn";

import { ContractActions } from "@/components/contract-view/ContractActions";

import { ContractZoom } from "@/components/contract-view/ContractZoom";

import { cn } from "@/lib/utils";



interface ContractToolbarProps {

  currentPage: number;

  totalPages: number;

  zoom: number;

  textScale: number;

  fitWidth: boolean;

  fullscreen: boolean;

  onPageChange: (page: number) => void;

  onZoomIn: () => void;

  onZoomOut: () => void;

  onFitWidth: () => void;

  onTextScaleDown: () => void;

  onTextScaleUp: () => void;

  onFullscreen: () => void;

  onSearch?: () => void;

  onDownload?: () => void;

  onPrint?: () => void;

  onShare?: () => void;

}



export function ContractToolbar({

  currentPage,

  totalPages,

  zoom,

  textScale,

  fitWidth,

  fullscreen,

  onPageChange,

  onZoomIn,

  onZoomOut,

  onFitWidth,

  onTextScaleDown,

  onTextScaleUp,

  onFullscreen,

  onSearch,

  onDownload,

  onPrint,

  onShare,

}: ContractToolbarProps) {

  return (

    <div className="border-b border-border-subtle bg-[#0c0c0c] shrink-0">

      <div className="flex items-center justify-end gap-1 px-3 py-2 border-b border-border-subtle">

        <ContractActions

          fullscreen={fullscreen}

          onFullscreen={onFullscreen}

          onSearch={onSearch}

          onDownload={onDownload}

          onPrint={onPrint}

          onShare={onShare}

        />

      </div>



      <div className="flex flex-wrap items-center gap-3 px-3 py-2">

        <div className="flex items-center gap-1.5">

          <Input

            type="number"

            min={1}

            max={totalPages}

            value={currentPage}

            onChange={(e) => {

              const n = Number(e.target.value);

              if (n >= 1 && n <= totalPages) onPageChange(n);

            }}

            className="h-8 w-10 px-1 text-center text-xs bg-surface-inset border-border-subtle tabular-nums"

          />

          <span className="text-xs text-muted-foreground tabular-nums">/ {totalPages}</span>

        </div>



        <ContractZoom

          zoom={zoom}

          fitWidth={fitWidth}

          onZoomIn={onZoomIn}

          onZoomOut={onZoomOut}

          onFitWidth={onFitWidth}

        />



        <div className="flex items-center gap-2 ml-auto">

          <span className="text-[10px] text-muted-foreground hidden sm:inline">Tamanho do texto</span>

          <div className="flex items-center gap-1 rounded-md border border-border-subtle p-0.5">

            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onTextScaleDown}>

              A

            </Button>

            <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-center">{textScale}%</span>

            <Button variant="ghost" size="sm" className="h-7 px-2 text-sm" onClick={onTextScaleUp}>

              A

            </Button>

          </div>

          <span className="text-[9px] text-muted-foreground hidden lg:inline">(Apenas para você)</span>

        </div>

      </div>

    </div>

  );

}



"use client";

import { Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";

interface AIExecutiveSummaryProps {
  summary: string;
}

export function AIExecutiveSummary({ summary }: AIExecutiveSummaryProps) {
  const handleCopy = () => {
    void navigator.clipboard.writeText(summary);
  };

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-foreground/70" />
          <h2 className="text-sm font-medium text-foreground">Resumo executivo</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1.5 text-[11px] border-border-subtle text-muted-foreground bg-surface/40"
        >
          <Copy className="h-3 w-3" />
          Copiar resumo
        </Button>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface ContractThumbnailProps {
  pageNumber: number;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ContractThumbnail({ pageNumber, active, onClick, children }: ContractThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded border bg-white overflow-hidden transition-all hover:border-white/40",
        active ? "border-white ring-1 ring-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" : "border-white/10"
      )}
    >
      {children ? (
        <div className="aspect-[210/297] overflow-hidden pointer-events-none">{children}</div>
      ) : (
        <div className="aspect-[210/297] p-2 flex flex-col">
          <div className="flex items-center gap-1 mb-2">
            <div className="h-2 w-2 rounded-sm bg-[#18181b]" />
            <div className="h-1 flex-1 rounded bg-[#e4e4e7]" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="h-0.5 w-full bg-[#f4f4f5] rounded" />
            <div className="h-0.5 w-4/5 bg-[#f4f4f5] rounded" />
            <div className="h-0.5 w-full bg-[#f4f4f5] rounded" />
            <div className="h-0.5 w-3/5 bg-[#f4f4f5] rounded" />
          </div>
          <div className="h-1 w-3 bg-[#18181b] rounded mt-1" />
        </div>
      )}
      <p className="text-[10px] text-muted-foreground text-center py-1.5 border-t border-border-subtle bg-surface/80">
        {pageNumber}
      </p>
    </button>
  );
}

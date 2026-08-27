import { cn } from "@/lib/utils";

interface ContractPreviewProps {
  title?: string;
  client?: string;
  number?: string;
  className?: string;
}

export function ContractPreview({ title, client, number, className }: ContractPreviewProps) {
  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full rounded-md border border-border-subtle bg-[#f4f4f5] overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-[#f4f4f5] p-3 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-4 rounded-sm bg-[#18181b]/10" />
          <div className="h-1.5 w-12 rounded-full bg-[#18181b]/10" />
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="h-1 w-full rounded-full bg-[#18181b]/12" />
          <div className="h-1 w-4/5 rounded-full bg-[#18181b]/10" />
          <div className="h-1 w-3/5 rounded-full bg-[#18181b]/8" />
        </div>

        {title && (
          <p className="text-[7px] font-semibold text-[#18181b]/80 leading-tight line-clamp-2 mb-2">
            {title}
          </p>
        )}

        <div className="space-y-1 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full bg-[#18181b]/8"
              style={{ width: `${85 - (i % 3) * 12}%` }}
            />
          ))}
        </div>

        <div className="mt-auto pt-2 border-t border-[#18181b]/10">
          {client && (
            <p className="text-[6px] text-[#18181b]/50 truncate">{client}</p>
          )}
          {number && (
            <p className="text-[6px] font-mono text-[#18181b]/40 mt-0.5">{number}</p>
          )}
        </div>
      </div>
    </div>
  );
}

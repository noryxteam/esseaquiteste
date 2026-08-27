import type { FunnelStage } from "@/lib/mock-data/relatorios-types";

interface SalesFunnelProps {
  stages: FunnelStage[];
}

export function SalesFunnel({ stages }: SalesFunnelProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5 h-full flex flex-col">
      <h2 className="text-sm font-medium text-foreground mb-4">Funil de projetos</h2>
      <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-2">
        {stages.map((stage, index) => (
          <div key={stage.id} className="w-full flex flex-col items-center">
            <div
              className={`h-7 rounded-sm flex items-center justify-between px-3 transition-all ${
                index >= 4 ? "text-white" : "text-[#09090b]"
              }`}
              style={{
                width: `${stage.width}%`,
                backgroundColor: stage.fill,
                minWidth: "120px",
              }}
            >
              <span className="text-[10px] font-medium truncate">{stage.label}</span>
              <span className="text-[10px] font-semibold tabular-nums ml-2">{stage.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

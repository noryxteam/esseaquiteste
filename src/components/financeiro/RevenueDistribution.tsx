import type { RevenueDistributionItem } from "@/lib/mock-data/financeiro-types";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";

interface RevenueDistributionProps {
  items: RevenueDistributionItem[];
}

export function RevenueDistribution({ items }: RevenueDistributionProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-foreground">Distribuição da receita</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-[10px] text-muted-foreground hover:text-foreground px-2"
        >
          Este mês
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] text-muted-foreground truncate">{item.label}</span>
              <span className="text-[11px] font-medium text-foreground tabular-nums shrink-0">
                {item.percentage}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-surface-inset overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/80 transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

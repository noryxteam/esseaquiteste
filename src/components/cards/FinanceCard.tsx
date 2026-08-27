import type { LucideIcon } from "lucide-react";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { cn } from "@/lib/utils";

export interface FinanceCardProps {
  title: string;
  amount: string;
  type?: "income" | "expense" | "neutral";
  date?: string;
  status?: React.ReactNode;
  statusLabel?: string;
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
}

const TYPE_ICON = {
  income: ArrowDownCircle,
  expense: ArrowUpCircle,
  neutral: DollarSign,
} as const;

const TYPE_TONE = {
  income: "text-state-green bg-state-green/10",
  expense: "text-state-red bg-state-red/10",
  neutral: "text-foreground/80 bg-white/10",
} as const;

export function FinanceCard({
  title,
  amount,
  type = "neutral",
  date,
  status,
  statusLabel,
  icon,
  subtitle,
  className,
}: FinanceCardProps) {
  const Icon = icon ?? TYPE_ICON[type];

  return (
    <BaseCard hover className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-foreground">
            {amount}
          </p>
          {subtitle && <p className="mt-1 text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", TYPE_TONE[type])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {(date || status || statusLabel) && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-3 text-[10px]">
          {date && <span className="text-muted-foreground">{date}</span>}
          {status ?? (statusLabel && <span className="text-foreground/70">{statusLabel}</span>)}
        </div>
      )}
    </BaseCard>
  );
}

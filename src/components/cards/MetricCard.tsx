import { BaseCard } from "./BaseCard";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  format?: "plain" | "currency" | "number" | "percent";
  suffix?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  format = "plain",
  suffix,
  className,
}: MetricCardProps) {
  let display: string;
  if (typeof value === "string") {
    display = value;
  } else if (format === "currency") {
    display = formatCurrency(value);
  } else if (format === "number") {
    display = formatNumber(value);
  } else if (format === "percent") {
    display = `${value}%`;
  } else {
    display = String(value);
  }

  return (
    <BaseCard padding="lg" className={className}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
        {display}
        {suffix && <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span>}
      </p>
      {change && (
        <p
          className={cn(
            "mt-2 text-xs",
            changeType === "up" && "text-state-green",
            changeType === "down" && "text-state-red",
            changeType === "neutral" && "text-muted-foreground"
          )}
        >
          {change}
        </p>
      )}
    </BaseCard>
  );
}

import { cn, formatCurrency, formatNumber } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  suffix,
  format = "plain",
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  suffix?: string;
  format?: "plain" | "currency" | "number";
}) {
  let display: string;
  if (typeof value === "string") {
    display = value;
  } else if (format === "currency") {
    display = formatCurrency(value);
  } else if (format === "number") {
    display = formatNumber(value);
  } else {
    display = String(value);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {display}
        {suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
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
    </div>
  );
}

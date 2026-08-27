import { BaseCard } from "./BaseCard";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

export interface ProgressCardProps {
  title: string;
  subtitle?: string;
  value: number;
  label?: string;
  color?: "default" | "green" | "blue" | "orange" | "red" | "purple";
  meta?: React.ReactNode;
  className?: string;
}

export function ProgressCard({
  title,
  subtitle,
  value,
  label,
  color = "default",
  meta,
  className,
}: ProgressCardProps) {
  return (
    <BaseCard className={className}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-foreground/70">
          {label ?? `${Math.min(100, Math.max(0, value))}%`}
        </span>
      </div>
      <ProgressBar value={value} color={color} />
      {meta && <div className="mt-3">{meta}</div>}
    </BaseCard>
  );
}

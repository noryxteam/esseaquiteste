import type { LucideIcon } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  comparison?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  children?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  comparison,
  trend = "neutral",
  className,
  children,
}: StatsCardProps) {
  return (
    <BaseCard hover className={cn("min-w-[160px]", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] text-muted-foreground">{title}</p>
          <p className="mt-1 truncate text-lg font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </p>
          {comparison && (
            <p
              className={cn(
                "mt-1 text-[9px] text-muted-foreground",
                trend === "up" && "text-foreground/60",
                trend === "down" && "text-muted-foreground/80"
              )}
            >
              {comparison}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10">
            <Icon className="h-3.5 w-3.5 text-foreground/80" />
          </div>
        )}
      </div>
      {children}
    </BaseCard>
  );
}

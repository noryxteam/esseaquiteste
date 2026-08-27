import type { LucideIcon } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { cn } from "@/lib/utils";

export interface InfoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function InfoCard({ title, description, icon: Icon, action, children, className }: InfoCardProps) {
  return (
    <BaseCard className={className}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
              <Icon className="h-4 w-4 text-foreground/80" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            {description && (
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children && <div className={cn(Icon || description ? "mt-1" : "")}>{children}</div>}
    </BaseCard>
  );
}

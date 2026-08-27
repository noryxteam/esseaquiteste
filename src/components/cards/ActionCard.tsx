import type { LucideIcon } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className,
}: ActionCardProps) {
  return (
    <BaseCard hover className={className}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10">
            <Icon className="h-4 w-4 text-foreground/80" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
          <div className={cn("mt-3 flex flex-wrap gap-2", !description && "mt-2")}>
            <Button size="sm" variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
            {secondaryLabel && onSecondary && (
              <Button size="sm" variant="ghost" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

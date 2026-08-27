import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BannerProps {
  title: string;
  description?: string;
  variant?: "info" | "warning" | "error" | "neutral";
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

const VARIANT_STYLES = {
  info: {
    border: "border-state-blue/20",
    bg: "bg-state-blue/5",
    text: "text-state-blue",
    icon: Info,
  },
  warning: {
    border: "border-state-orange/25",
    bg: "bg-state-orange/5",
    text: "text-state-orange",
    icon: AlertTriangle,
  },
  error: {
    border: "border-state-red/20",
    bg: "bg-state-red/5",
    text: "text-state-red",
    icon: AlertTriangle,
  },
  neutral: {
    border: "border-border-subtle",
    bg: "bg-surface/40",
    text: "text-foreground",
    icon: Info,
  },
} as const;

export function Banner({
  title,
  description,
  variant = "neutral",
  icon,
  actionLabel,
  onAction,
  dismissLabel,
  onDismiss,
  className,
}: BannerProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = icon ?? styles.icon;

  return (
    <div className={cn("rounded-xl border p-3.5", styles.border, styles.bg, className)}>
      <div className="flex items-start gap-2.5">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", styles.text)} />
        <div className="min-w-0 flex-1">
          <p className={cn("text-[13px] font-medium leading-snug", styles.text)}>{title}</p>
          {description && (
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{description}</p>
          )}
          {(onAction || onDismiss) && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {onAction && actionLabel && (
                <Button size="sm" variant="secondary" onClick={onAction}>
                  {actionLabel}
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  {dismissLabel ?? "Dispensar"}
                </Button>
              )}
            </div>
          )}
        </div>
        {onDismiss && !onAction && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

interface BlockBannerProps {
  type: string;
  description: string;
  days?: number;
  onPrimary?: () => void;
  onResolve?: () => void;
  primaryLabel?: string;
}

export function BlockBanner({
  type,
  description,
  days,
  onPrimary,
  onResolve,
  primaryLabel = "Registrar material",
}: BlockBannerProps) {
  return (
    <div className="rounded-xl border border-warning/25 bg-warning-subtle p-3.5">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-warning leading-snug">
            Bloqueio: {type} — {description}
            {days !== undefined && (
              <span className="text-muted-foreground font-normal"> · há {days} dias</span>
            )}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {onPrimary && (
              <Button size="sm" variant="secondary" onClick={onPrimary}>
                {primaryLabel}
              </Button>
            )}
            {onResolve && (
              <Button size="sm" variant="ghost" onClick={onResolve}>
                Resolver bloqueio
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

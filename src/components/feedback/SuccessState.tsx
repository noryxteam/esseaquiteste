import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SuccessStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SuccessState({
  title = "Concluído com sucesso",
  message,
  actionLabel,
  onAction,
  className,
}: SuccessStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-state-green/20 bg-[#090909] px-6 py-10 text-center",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-state-green/20 bg-state-green/5">
        <CheckCircle2 className="h-5 w-5 text-state-green" />
      </div>
      <p className="mt-4 text-[13px] font-medium text-foreground">{title}</p>
      {message && <p className="mt-1 max-w-sm text-[12px] text-muted-foreground">{message}</p>}
      {onAction && actionLabel && (
        <Button className="mt-4" size="sm" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

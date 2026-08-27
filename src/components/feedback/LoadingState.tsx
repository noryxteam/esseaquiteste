import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title = "Carregando...",
  description,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-border-subtle bg-[#090909] px-6 py-10 text-center",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="mt-4 text-[13px] font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-xs text-[12px] text-muted-foreground">{description}</p>}
    </div>
  );
}

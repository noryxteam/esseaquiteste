import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  message: string;
  title?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  onClose?: () => void;
  className?: string;
}

const VARIANT_STYLES = {
  default: "border-border bg-[#090909] text-foreground",
  success: "border-state-green/20 bg-[#090909] text-foreground",
  error: "border-state-red/20 bg-[#090909] text-foreground",
  warning: "border-state-orange/20 bg-[#090909] text-foreground",
  info: "border-state-blue/20 bg-[#090909] text-foreground",
} as const;

const DOT_STYLES = {
  default: "bg-foreground/60",
  success: "bg-state-green",
  error: "bg-state-red",
  warning: "bg-state-orange",
  info: "bg-state-blue",
} as const;

export function Toast({ message, title, variant = "default", onClose, className }: ToastProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg shadow-black/30",
        VARIANT_STYLES[variant],
        className
      )}
    >
      <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", DOT_STYLES[variant])} />
      <div className="min-w-0 flex-1">
        {title && <p className="text-[13px] font-medium text-foreground">{title}</p>}
        <p className={cn("text-[12px] text-muted-foreground", title && "mt-0.5")}>{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

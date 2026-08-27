import type { LucideIcon } from "lucide-react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  title?: string;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

const VARIANT_CONFIG = {
  info: {
    icon: Info,
    border: "border-state-blue/20",
    bg: "bg-state-blue/5",
    text: "text-state-blue",
  },
  success: {
    icon: CheckCircle2,
    border: "border-state-green/20",
    bg: "bg-state-green/5",
    text: "text-state-green",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-state-orange/20",
    bg: "bg-state-orange/5",
    text: "text-state-orange",
  },
  error: {
    icon: AlertCircle,
    border: "border-state-red/20",
    bg: "bg-state-red/5",
    text: "text-state-red",
  },
} as const;

export function Alert({ title, message, variant = "info", icon, action, className }: AlertProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = icon ?? config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border p-3.5",
        config.border,
        config.bg,
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.text)} />
        <div className="min-w-0 flex-1">
          {title && <p className={cn("text-[13px] font-medium leading-snug", config.text)}>{title}</p>}
          <p className={cn("text-[12px] leading-relaxed text-foreground/80", title && "mt-1")}>{message}</p>
          {action && <div className="mt-2.5">{action}</div>}
        </div>
      </div>
    </div>
  );
}

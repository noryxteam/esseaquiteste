import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationProps {
  title: string;
  message?: string;
  time?: string;
  read?: boolean;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  onClick?: () => void;
  className?: string;
}

export function Notification({
  title,
  message,
  time,
  read = false,
  icon,
  onDismiss,
  onClick,
  className,
}: NotificationProps) {
  return (
    <div
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "group relative flex gap-3 rounded-lg border border-border-subtle bg-[#090909] p-3 transition-colors",
        !read && "bg-surface/40",
        onClick && "cursor-pointer hover:border-border hover:bg-surface-hover/40",
        className
      )}
    >
      {!read && (
        <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground" />
      )}

      {icon && <div className="ml-2 shrink-0">{icon}</div>}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-[13px] text-foreground", !read && "font-medium")}>{title}</p>
          {time && <span className="shrink-0 text-[10px] text-muted-foreground">{time}</span>}
        </div>
        {message && <p className="mt-0.5 text-[12px] text-muted-foreground line-clamp-2">{message}</p>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="shrink-0 rounded-md p-0.5 text-muted-foreground opacity-0 transition-all hover:text-foreground group-hover:opacity-100"
          aria-label="Dispensar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "xs" | "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150",
        "focus-ring disabled:opacity-40 disabled:pointer-events-none",
        "active:scale-[0.98]",
        size === "xs" && "px-2 py-1 text-[11px] rounded-md gap-1",
        size === "sm" && "px-3 py-1.5 text-[13px] rounded-lg gap-1.5",
        size === "md" && "px-4 py-2 text-sm rounded-lg gap-2",
        variant === "primary" &&
          "bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm shadow-black/20",
        variant === "secondary" &&
          "bg-surface-elevated border border-border text-foreground-secondary hover:bg-surface-hover hover:border-border-strong",
        variant === "outline" &&
          "border border-border text-foreground-secondary hover:bg-surface-hover hover:border-border-strong",
        variant === "ghost" &&
          "text-muted hover:text-foreground hover:bg-surface-hover",
        variant === "danger" &&
          "bg-danger-subtle text-danger hover:bg-danger/20 border border-danger/20",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md";
}

export function ActionButton({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-[0.98]",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variant === "primary" && "bg-accent text-accent-foreground hover:opacity-90",
        variant === "secondary" && "bg-surface-elevated border border-border text-foreground-secondary hover:bg-surface-hover",
        variant === "outline" && "border border-border text-foreground-secondary hover:bg-surface-hover",
        variant === "ghost" && "text-muted-foreground hover:text-foreground hover:bg-surface-hover",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

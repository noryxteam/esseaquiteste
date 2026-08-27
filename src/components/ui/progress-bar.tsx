import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  color = "default",
}: {
  value: number;
  className?: string;
  color?: "default" | "green" | "blue" | "orange" | "red" | "purple";
}) {
  const fill: Record<string, string> = {
    default: "bg-foreground",
    green: "bg-state-green",
    blue: "bg-state-blue",
    orange: "bg-state-orange",
    red: "bg-state-red",
    purple: "bg-state-purple",
  };

  return (
    <div className={cn("h-1.5 rounded-full bg-surface-inset border border-border-subtle overflow-hidden", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", fill[color])} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

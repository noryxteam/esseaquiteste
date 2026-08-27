import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default: "bg-surface-elevated text-muted border-border",
  blue: "bg-blue-500/10 text-state-blue border-blue-500/20",
  green: "bg-green-500/10 text-state-green border-green-500/20",
  orange: "bg-orange-500/10 text-state-orange border-orange-500/20",
  red: "bg-red-500/10 text-state-red border-red-500/20",
  purple: "bg-purple-500/10 text-state-purple border-purple-500/20",
};

export function StatusBadge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: keyof typeof variants;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border", variants[variant])}>
      {label}
    </span>
  );
}

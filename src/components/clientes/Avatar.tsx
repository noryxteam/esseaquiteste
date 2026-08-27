import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

export function Avatar({ initials, className, size = "md" }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-surface-elevated border border-border-subtle flex items-center justify-center font-medium text-foreground/80 shrink-0",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

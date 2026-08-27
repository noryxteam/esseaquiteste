import { cn } from "@/lib/utils";

interface TabUnderlineProps {
  className?: string;
}

export function TabUnderline({ className }: TabUnderlineProps) {
  return (
    <span
      className={cn("absolute bottom-0 left-0 right-0 h-px bg-foreground", className)}
      aria-hidden
    />
  );
}

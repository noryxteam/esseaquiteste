import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

export function ButtonLoader({ size = "md", className }: ButtonLoaderProps) {
  return (
    <Loader2
      role="status"
      aria-label="Carregando"
      className={cn("animate-spin text-current", SIZE_MAP[size], className)}
    />
  );
}

import { cn } from "@/lib/utils";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical spacing between children. Defaults to `5` (20px). */
  spacing?: "3" | "4" | "5" | "6" | "8";
}

const spacingClasses = {
  "3": "space-y-3",
  "4": "space-y-4",
  "5": "space-y-5",
  "6": "space-y-6",
  "8": "space-y-8",
} as const;

export function ContentWrapper({ children, className, spacing = "5" }: ContentWrapperProps) {
  return <div className={cn(spacingClasses[spacing], className)}>{children}</div>;
}

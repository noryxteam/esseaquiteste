import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Max width preset. Defaults to dashboard standard (1600px). */
  size?: "default" | "narrow" | "wide" | "full";
}

const sizeClasses = {
  default: "max-w-[1600px]",
  narrow: "max-w-4xl",
  wide: "max-w-[1920px]",
  full: "max-w-none",
} as const;

export function PageContainer({ children, className, size = "default" }: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

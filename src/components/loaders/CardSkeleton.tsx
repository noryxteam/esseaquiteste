import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

export interface CardSkeletonProps {
  lines?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function CardSkeleton({
  lines = 3,
  showHeader = true,
  showFooter = false,
  className,
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle bg-[#090909] p-4 space-y-3",
        className
      )}
    >
      {showHeader && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={cn("h-2.5", i === lines - 1 ? "w-3/5" : "w-full")} />
        ))}
      </div>
      {showFooter && (
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <Skeleton className="h-2.5 w-1/4" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      )}
    </div>
  );
}

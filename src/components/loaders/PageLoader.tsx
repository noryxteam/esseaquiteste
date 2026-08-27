import { Loader2 } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

export interface PageLoaderProps {
  message?: string;
  variant?: "spinner" | "skeleton";
  className?: string;
}

export function PageLoader({ message, variant = "skeleton", className }: PageLoaderProps) {
  if (variant === "spinner") {
    return (
      <div
        role="status"
        className={cn(
          "flex min-h-[40vh] flex-col items-center justify-center bg-[#090909]",
          className
        )}
      >
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        {message && <p className="mt-4 text-[13px] text-muted-foreground">{message}</p>}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 animate-fade-in bg-[#090909]", className)}>
      <div className="flex justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-28" />
      </div>
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      {message && <p className="text-center text-[12px] text-muted-foreground">{message}</p>}
    </div>
  );
}

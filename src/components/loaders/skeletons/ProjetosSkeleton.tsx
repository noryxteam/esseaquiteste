import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { StatsRowSkeleton } from "./StatsRowSkeleton";
import { Skeleton } from "@/components/loaders/Skeleton";

export function ProjetosSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <PageHeaderSkeleton />
      <StatsRowSkeleton />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28" />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div>
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4 space-y-3 h-44" />
          ))}
        </div>
      </div>
    </div>
  );
}

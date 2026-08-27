import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { StatsRowSkeleton } from "./StatsRowSkeleton";
import { TableSkeleton } from "@/components/loaders/TableSkeleton";
import { Skeleton } from "@/components/loaders/Skeleton";

export function ContratosSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <PageHeaderSkeleton />
      <StatsRowSkeleton />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28" />
        ))}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 max-w-xs" />
        <Skeleton className="h-9 w-24" />
      </div>
      <TableSkeleton rows={8} columns={7} />
    </div>
  );
}

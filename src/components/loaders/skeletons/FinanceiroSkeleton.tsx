import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { StatsRowSkeleton } from "./StatsRowSkeleton";
import { TableSkeleton } from "@/components/loaders/TableSkeleton";
import { ChartSkeleton } from "./ChartSkeleton";
import { Skeleton } from "@/components/loaders/Skeleton";

export function FinanceiroSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <PageHeaderSkeleton />
      <StatsRowSkeleton />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartSkeleton height={200} />
        <ChartSkeleton height={200} />
        <ChartSkeleton height={200} />
      </div>
      <TableSkeleton rows={8} columns={6} />
    </div>
  );
}

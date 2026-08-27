import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { StatsRowSkeleton } from "./StatsRowSkeleton";
import { ChartSkeleton } from "./ChartSkeleton";
import { Skeleton } from "@/components/loaders/Skeleton";

export function RelatoriosSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <PageHeaderSkeleton />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>
      <StatsRowSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <ChartSkeleton height={320} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartSkeleton height={240} />
        <ChartSkeleton height={240} />
      </div>
    </div>
  );
}

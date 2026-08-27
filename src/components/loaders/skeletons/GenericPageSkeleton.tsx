import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { StatsRowSkeleton } from "./StatsRowSkeleton";
import { Skeleton } from "@/components/loaders/Skeleton";

export function GenericPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <PageHeaderSkeleton />
      <StatsRowSkeleton count={4} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3 h-48" />
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3 h-48" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

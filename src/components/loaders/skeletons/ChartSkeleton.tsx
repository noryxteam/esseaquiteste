import { Skeleton } from "@/components/loaders/Skeleton";

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="rounded-lg border border-border bg-surface p-4 space-y-4"
      style={{ minHeight: height }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="w-full" style={{ height: height - 80 }}>
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}

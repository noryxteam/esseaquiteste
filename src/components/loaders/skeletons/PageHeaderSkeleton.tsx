import { Skeleton } from "@/components/loaders/Skeleton";

export function PageHeaderSkeleton({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <div>
      <Skeleton className="h-8 w-48" />
      {subtitle && <Skeleton className="h-4 w-72 mt-2" />}
    </div>
  );
}

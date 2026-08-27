import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { StatsRowSkeleton } from "./StatsRowSkeleton";
import { TableSkeleton } from "@/components/loaders/TableSkeleton";
import { SidebarWidgetsSkeleton } from "./SidebarWidgetsSkeleton";
import { Skeleton } from "@/components/loaders/Skeleton";

export function ClientesSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 animate-pulse">
      <div className="flex-1 min-w-0 space-y-5">
        <PageHeaderSkeleton />
        <StatsRowSkeleton />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
        <TableSkeleton rows={8} columns={7} />
      </div>
      <aside className="w-full xl:w-[300px] shrink-0">
        <SidebarWidgetsSkeleton count={4} />
      </aside>
    </div>
  );
}

import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { StatsRowSkeleton } from "./StatsRowSkeleton";
import { TableSkeleton } from "@/components/loaders/TableSkeleton";
import { SidebarWidgetsSkeleton } from "./SidebarWidgetsSkeleton";
import { Skeleton } from "@/components/loaders/Skeleton";

export function ReunioesSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-pulse">
      <div className="flex-1 space-y-5">
        <PageHeaderSkeleton />
        <StatsRowSkeleton count={4} />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
        <TableSkeleton rows={6} columns={6} />
      </div>
      <aside className="w-full xl:w-[320px] shrink-0">
        <SidebarWidgetsSkeleton count={2} />
      </aside>
    </div>
  );
}

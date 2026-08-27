export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-56 rounded-md bg-surface-elevated" />
        <div className="h-4 w-72 rounded-md bg-surface-elevated mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-lg bg-surface-elevated border border-border" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[280px] rounded-lg bg-surface-elevated border border-border" />
        <div className="h-[280px] rounded-lg bg-surface-elevated border border-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="h-48 rounded-lg bg-surface-elevated border border-border" />
        <div className="h-56 rounded-lg bg-surface-elevated border border-border" />
        <div className="h-40 rounded-lg bg-surface-elevated border border-border" />
      </div>
      <div className="h-64 rounded-lg bg-surface-elevated border border-border" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-surface-elevated border border-border" />
        ))}
      </div>
    </div>
  );
}

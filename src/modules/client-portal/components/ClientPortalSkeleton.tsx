"use client";

export function ClientPortalSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-20 rounded portal-skeleton" />
        <div className="h-8 w-28 rounded-full portal-skeleton" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          <div className="h-9 w-2/3 rounded portal-skeleton" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 rounded portal-skeleton" />
            <div className="h-12 rounded portal-skeleton" />
            <div className="h-12 rounded portal-skeleton" />
          </div>
        </div>
        <div className="h-36 rounded-xl portal-skeleton" />
      </div>
      <div className="h-16 rounded-xl portal-skeleton" />
      <div className="space-y-4">
        <div className="h-6 w-40 rounded portal-skeleton" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl portal-skeleton" />
        ))}
      </div>
    </div>
  );
}

export default function ContractViewLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div className="h-4 w-40 rounded bg-surface-elevated" />
        <div className="h-8 w-64 rounded bg-surface-elevated" />
        <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-surface-elevated border border-border" />
          ))}
        </div>
        <div className="flex gap-8">
          <div className="flex-1 h-[800px] rounded-lg bg-surface-elevated border border-border" />
          <div className="hidden xl:block w-[300px] space-y-4">
            <div className="h-48 rounded-lg bg-surface-elevated border border-border" />
            <div className="h-56 rounded-lg bg-surface-elevated border border-border" />
          </div>
        </div>
      </div>
    </div>
  );
}

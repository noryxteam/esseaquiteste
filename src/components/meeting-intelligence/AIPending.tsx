interface AIPendingProps {
  pending: string[];
}

export function AIPending({ pending }: AIPendingProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 h-full">
      <h3 className="text-xs font-medium text-foreground mb-3">Pendências</h3>
      <ul className="space-y-2.5">
        {pending.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-1 h-3 w-3 rounded-full border border-border-strong shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

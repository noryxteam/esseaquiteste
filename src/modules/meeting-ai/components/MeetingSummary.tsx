interface MeetingSummaryProps {
  summary: string | null;
  className?: string;
}

export function MeetingSummary({ summary, className }: MeetingSummaryProps) {
  if (!summary) return null;
  return (
    <div className={className}>
      <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5">
        <h3 className="text-xs font-medium text-foreground mb-3">Resumo executivo</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}

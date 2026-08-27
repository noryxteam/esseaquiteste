interface AIKeywordsProps {
  keywords: string[];
}

export function AIKeywords({ keywords }: AIKeywordsProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5">
      <h3 className="text-xs font-medium text-foreground mb-3">Palavras-chave identificadas</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="inline-flex items-center rounded-md border border-border-subtle bg-surface-inset px-2.5 py-1 text-[10px] text-muted-foreground"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

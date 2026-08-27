interface AIObjectivesProps {
  objectives: string[];
}

export function AIObjectives({ objectives }: AIObjectivesProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 h-full">
      <h3 className="text-xs font-medium text-foreground mb-3">Objetivos do cliente</h3>
      <ul className="space-y-2">
        {objectives.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Check } from "lucide-react";

interface AIDecisionsProps {
  decisions: string[];
}

export function AIDecisions({ decisions }: AIDecisionsProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4 h-full">
      <h3 className="text-xs font-medium text-foreground mb-3">Decisões tomadas</h3>
      <ul className="space-y-2.5">
        {decisions.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-foreground/70 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Check } from "lucide-react";
import type { MeetingDecision } from "@/modules/meeting-ai/types";
import { cn } from "@/lib/utils";

interface MeetingDecisionsProps {
  decisions: MeetingDecision[];
  className?: string;
}

const IMPACT_LABEL: Record<MeetingDecision["impact"], string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
};

export function MeetingDecisions({ decisions, className }: MeetingDecisionsProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4", className)}>
      <h3 className="text-xs font-medium text-foreground mb-3">Decisões tomadas</h3>
      <ul className="space-y-3">
        {decisions.map((d) => (
          <li key={d.id} className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-foreground/60 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">{d.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{d.description}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">
                {d.responsible} · {d.date} · Impacto {IMPACT_LABEL[d.impact]}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

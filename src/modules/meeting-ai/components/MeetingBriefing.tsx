import type { MeetingBriefing } from "@/modules/meeting-ai/types";
import { cn } from "@/lib/utils";

interface MeetingBriefingProps {
  briefing: MeetingBriefing | null;
  className?: string;
}

export function MeetingBriefingView({ briefing, className }: MeetingBriefingProps) {
  if (!briefing) return null;

  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4 sm:p-5 space-y-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">{briefing.title}</h3>
          <p className="text-[10px] text-muted-foreground mt-1">
            {briefing.project} · {briefing.client} · v{briefing.version}
          </p>
        </div>
        <div className="text-right text-[10px] text-muted-foreground">
          <p>{briefing.date}</p>
          <p>{briefing.time} · {briefing.duration}</p>
        </div>
      </div>

      <section>
        <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Resumo executivo</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{briefing.executiveSummary}</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BriefingList title="Objetivos" items={briefing.objectives} />
        <BriefingList title="Assuntos discutidos" items={briefing.discussedTopics} />
        <BriefingList title="Pendências" items={briefing.pending} />
        <BriefingList title="Riscos" items={briefing.risks} />
        <BriefingList title="Observações" items={briefing.observations} />
      </div>

      <section>
        <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Próximos passos</h4>
        <ul className="space-y-2">
          {briefing.nextSteps.map((step) => (
            <li key={step.description} className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{step.description}</span>
              <span className="text-[10px] shrink-0">{step.responsible} · {step.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function BriefingList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

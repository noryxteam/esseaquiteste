import { AlertTriangle, Lightbulb, CircleDot, TrendingUp, Clock } from "lucide-react";
import type { MeetingInsight, InsightType } from "@/modules/meeting-ai/types";
import { cn } from "@/lib/utils";

const INSIGHT_ICONS: Record<InsightType, React.ComponentType<{ className?: string }>> = {
  risk: AlertTriangle,
  important: CircleDot,
  suggestion: Lightbulb,
  improvement: TrendingUp,
  pending: Clock,
};

interface MeetingInsightsProps {
  insights: MeetingInsight[];
  className?: string;
}

export function MeetingInsights({ insights, className }: MeetingInsightsProps) {
  return (
    <div className={cn("rounded-lg border border-border-subtle bg-surface/60 p-4", className)}>
      <h3 className="text-xs font-medium text-foreground mb-3">Insights</h3>
      <ul className="space-y-3">
        {insights.map((insight) => {
          const Icon = INSIGHT_ICONS[insight.type];
          return (
            <li key={insight.id} className="flex items-start gap-2.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground/90">{insight.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{insight.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

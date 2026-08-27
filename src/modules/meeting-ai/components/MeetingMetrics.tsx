import type { MeetingMetrics } from "@/modules/meeting-ai/types";
import { formatElapsed } from "@/modules/meeting-ai/utils";
import { cn } from "@/lib/utils";

interface MeetingMetricsProps {
  metrics: MeetingMetrics;
  className?: string;
}

export function MeetingMetricsView({ metrics, className }: MeetingMetricsProps) {
  const items = [
    { label: "Tempo decorrido", value: formatElapsed(metrics.elapsedSeconds) },
    { label: "Participantes", value: String(metrics.participantCount) },
    { label: "Duração da reunião", value: `${metrics.meetingDurationMinutes} min` },
    { label: "Palavras", value: metrics.wordCount.toLocaleString("pt-BR") },
    { label: "Segmentos", value: String(metrics.transcriptSegments) },
  ];

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", className)}>
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border-subtle bg-surface/60 p-3">
          <p className="text-[10px] text-muted-foreground">{item.label}</p>
          <p className="text-sm font-semibold text-foreground tabular-nums mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

import { Calendar } from "lucide-react";
import type { NextMeetingData } from "@/lib/mock-data/meeting-intelligence-types";
import { Button } from "@/components/ui/button-shadcn";

interface NextMeetingCardProps {
  nextMeeting: NextMeetingData;
}

export function NextMeetingCard({ nextMeeting }: NextMeetingCardProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-foreground">Próxima reunião</h2>
      </div>

      <div className="space-y-1 mb-4">
        <p className="text-xs text-muted-foreground">
          {nextMeeting.date} · {nextMeeting.time}
        </p>
        <p className="text-xs text-foreground/90 leading-relaxed">{nextMeeting.title}</p>
      </div>

      <Button
        variant="outline"
        className="w-full h-9 text-xs border-border-subtle text-muted-foreground bg-surface/40 hover:text-foreground"
      >
        Editar próxima reunião
      </Button>
    </div>
  );
}

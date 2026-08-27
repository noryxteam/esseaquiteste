"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { Meeting } from "@/lib/mock-data/reunioes-types";
import { MeetingParticipants } from "@/components/reunioes/MeetingParticipants";
import { Button } from "@/components/ui/button-shadcn";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";
import { hasMeetingIntelligence } from "@/lib/meeting-routes";

interface MeetingSummaryCardProps {
  meeting?: Meeting;
}

export function MeetingSummaryCard({ meeting }: MeetingSummaryCardProps) {
  const router = useRouter();
  const { showInfo } = useFeedback();

  if (!meeting) {
    return (
      <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
        <h3 className="text-xs font-medium text-foreground mb-2">Resumo da reunião</h3>
        <p className="text-xs text-muted-foreground">Selecione uma reunião na agenda.</p>
      </div>
    );
  }

  const hasAi = hasMeetingIntelligence(meeting.id);

  const handleGenerateMinutes = () => {
    if (hasAi) {
      router.push(routes.reuniaoAi(meeting.id));
    } else {
      showInfo("Inteligência da reunião não disponível para esta reunião.");
    }
  };

  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <h3 className="text-xs font-medium text-foreground mb-3">Resumo da reunião</h3>
      <p className="text-sm font-medium text-foreground">{meeting.title}</p>
      <p className="text-[11px] text-muted-foreground mt-1">
        {meeting.project} · {meeting.client}
      </p>

      {hasAi ? (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-3 w-full h-8 gap-1.5 text-xs border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        >
          <Link href={routes.reuniaoAi(meeting.id)}>
            <Sparkles className="h-3.5 w-3.5" />
            Gerar ata com IA
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={handleGenerateMinutes}
          className="mt-3 w-full h-8 gap-1.5 text-xs border-border-subtle text-muted-foreground hover:text-foreground hover:bg-surface-hover"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Gerar ata com IA
        </Button>
      )}

      {meeting.status === "em-andamento" && (
        <span className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-medium text-state-green">
          <span className="h-1.5 w-1.5 rounded-full bg-state-green shrink-0" />
          Em andamento
        </span>
      )}

      <div className="mt-4 pt-3 border-t border-border-subtle">
        <p className="text-[10px] text-muted-foreground mb-2">Participantes</p>
        <MeetingParticipants participants={meeting.participants} max={4} size="md" />
      </div>
    </div>
  );
}

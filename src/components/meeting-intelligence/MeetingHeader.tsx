"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Play, Search, Share2, SlidersHorizontal, Sparkles } from "lucide-react";
import type { MeetingIntelligenceData } from "@/lib/mock-data/meeting-intelligence-types";
import { getMeetingAIEngineHref } from "@/lib/meeting-routes";
import { ParticipantAvatarGroup } from "@/components/meeting-intelligence/ParticipantAvatar";
import { useFeedback } from "@/contexts/feedback-context";
import { AppModal } from "@/components/ui/app-modal";
import { useState } from "react";
import { Input } from "@/components/ui/input-shadcn";
import { Button } from "@/components/ui/button-shadcn";

interface MeetingHeaderProps {
  meeting: MeetingIntelligenceData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MeetingHeader({ meeting, searchQuery, onSearchChange }: MeetingHeaderProps) {
  const aiEngineHref = getMeetingAIEngineHref(meeting.id);
  const { showInfo, showSuccess } = useFeedback();
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);

  const filteredTitle = searchQuery.trim()
    ? meeting.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    : true;

  if (!filteredTitle && searchQuery.trim()) {
    return (
      <div className="rounded-lg border border-dashed border-border-subtle p-8 text-center text-sm text-muted-foreground">
        Nenhum resultado para &quot;{searchQuery}&quot;
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/reunioes"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar para reuniões
      </Link>

      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {meeting.title}
            </h1>
            <span className="inline-flex items-center rounded-md border border-border-subtle bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {meeting.statusLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {meeting.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {meeting.startTime} – {meeting.endTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 opacity-60" />
              {meeting.duration}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ParticipantAvatarGroup participants={meeting.participants} max={3} size="md" />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setParticipantsOpen(true)}
              className="h-7 text-[11px] border-border-subtle text-muted-foreground bg-surface/40"
            >
              Ver participantes
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="pl-8 h-9 text-xs bg-surface-inset border-border-subtle"
            />
          </div>
          <div className="flex items-center gap-2">
            {aiEngineHref && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs border-border-subtle text-muted-foreground bg-surface/40"
              >
                <Link href={aiEngineHref}>
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Engine
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => showInfo("Reprodução da gravação em breve. Integração com storage pendente.")}
              className="h-9 gap-1.5 text-xs border-border-subtle text-muted-foreground bg-surface/40"
            >
              <Play className="h-3.5 w-3.5" />
              Assistir gravação
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setLayoutOpen(true)}
              className="h-9 w-9 border-border-subtle text-muted-foreground bg-surface/40 shrink-0"
              aria-label="Layout"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              type="button"
              onClick={() => showSuccess("Link da ata copiado para a área de transferência.")}
              className="h-9 gap-1.5 text-xs shrink-0"
            >
              <Share2 className="h-3.5 w-3.5" />
              Compartilhar ata
            </Button>
          </div>
        </div>
      </div>

      <AppModal open={participantsOpen} onClose={() => setParticipantsOpen(false)} title="Participantes">
        <ul className="space-y-3">
          {meeting.participants.map((p) => (
            <li key={p.id} className="flex items-center gap-3 text-sm">
              <span className="h-8 w-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-xs font-medium">
                {p.initials}
              </span>
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </AppModal>

      <AppModal open={layoutOpen} onClose={() => setLayoutOpen(false)} title="Layout da reunião" size="sm">
        <p className="text-xs text-muted-foreground mb-4">Escolha como exibir o painel desta reunião.</p>
        <div className="flex flex-col gap-2">
          {["Padrão", "Foco em vídeo", "Foco em transcrição"].map((opt) => (
            <Button
              key={opt}
              variant="outline"
              size="sm"
              type="button"
              className="justify-start"
              onClick={() => {
                setLayoutOpen(false);
                showInfo(`Layout "${opt}" aplicado.`);
              }}
            >
              {opt}
            </Button>
          ))}
        </div>
      </AppModal>
    </div>
  );
}

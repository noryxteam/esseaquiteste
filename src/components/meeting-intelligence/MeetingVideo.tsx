"use client";

import { useState } from "react";
import {
  Maximize2,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreHorizontal,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import type { VideoParticipant } from "@/lib/mock-data/meeting-intelligence-types";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

interface MeetingVideoProps {
  participants: VideoParticipant[];
}

function VideoPanel({
  participant,
  showControls,
  onFullscreen,
  onControl,
}: {
  participant: VideoParticipant;
  showControls?: boolean;
  onFullscreen: () => void;
  onControl: (action: string) => void;
}) {
  return (
    <div className="relative flex-1 min-w-0 aspect-[4/3] rounded-lg border border-border-subtle bg-surface-inset overflow-hidden">
      {participant.isRecording && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-state-red animate-pulse" />
          <span className="text-[9px] font-medium text-foreground/90">Gravação</span>
        </div>
      )}

      <button
        type="button"
        onClick={onFullscreen}
        className="absolute top-2.5 right-2.5 z-10 h-7 w-7 rounded-md bg-black/40 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
        aria-label="Tela cheia"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>

      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-surface-elevated/40 to-surface-inset">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-lg font-semibold text-foreground/60">
          {participant.initials}
        </div>
      </div>

      <div className="absolute bottom-2.5 left-2.5 z-10">
        <span className="text-[10px] font-medium text-foreground/90 bg-black/50 px-2 py-0.5 rounded">
          {participant.name}
        </span>
      </div>

      {showControls && (
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1">
          <ControlButton icon={Mic} active label="Microfone" onClick={() => onControl("Microfone")} />
          <ControlButton icon={Video} active label="Câmera" onClick={() => onControl("Câmera")} />
          <ControlButton icon={MonitorUp} label="Compartilhar tela" onClick={() => onControl("Compartilhar tela")} />
          <ControlButton icon={MessageSquare} label="Chat" onClick={() => onControl("Chat")} />
          <ControlButton icon={MoreHorizontal} label="Mais opções" onClick={() => onControl("Mais opções")} />
          <button
            type="button"
            onClick={() => onControl("Encerrar chamada")}
            className="h-7 w-7 rounded-md bg-state-red/90 flex items-center justify-center text-white hover:bg-state-red transition-colors"
            aria-label="Encerrar chamada"
          >
            <PhoneOff className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {!showControls && (
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1">
          <ControlButton icon={MicOff} label="Microfone" onClick={() => onControl("Microfone")} />
          <ControlButton icon={VideoOff} label="Câmera" onClick={() => onControl("Câmera")} />
          <ControlButton icon={MonitorUp} label="Compartilhar tela" onClick={() => onControl("Compartilhar tela")} />
        </div>
      )}
    </div>
  );
}

function ControlButton({
  icon: Icon,
  active,
  onClick,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "h-7 w-7 rounded-md flex items-center justify-center transition-colors",
        active
          ? "bg-white/10 text-foreground hover:bg-white/15"
          : "bg-black/50 text-foreground/70 hover:text-foreground hover:bg-black/60"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export function MeetingVideo({ participants }: MeetingVideoProps) {
  const { showInfo } = useFeedback();
  const handleControl = (action: string) => showInfo(`${action} — disponível após integração com videoconferência.`);

  return (
    <div className="flex gap-2 sm:gap-3">
      {participants.map((participant, i) => (
        <VideoPanel
          key={participant.id}
          participant={participant}
          showControls={i === 1}
          onFullscreen={() => showInfo("Modo tela cheia ativado.")}
          onControl={handleControl}
        />
      ))}
    </div>
  );
}

"use client";

import { CheckCircle2 } from "lucide-react";
import type { TranscriptMessage } from "@/lib/mock-data/meeting-intelligence-types";
import { SearchTranscript } from "@/components/meeting-intelligence/SearchTranscript";
import { TranscriptMessageItem } from "@/components/meeting-intelligence/TranscriptMessage";

interface MeetingTranscriptProps {
  messages: TranscriptMessage[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MeetingTranscript({ messages, searchQuery, onSearchChange }: MeetingTranscriptProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 flex flex-col min-h-[320px] max-h-[480px]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">Transcrição da reunião</h2>
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-foreground/60" />
            Concluída
          </span>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border-subtle shrink-0">
        <SearchTranscript value={searchQuery} onChange={onSearchChange} />
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {messages.length > 0 ? (
          messages.map((msg) => <TranscriptMessageItem key={msg.id} message={msg} />)
        ) : (
          <p className="py-8 text-center text-xs text-muted-foreground">Nenhuma mensagem encontrada.</p>
        )}
      </div>
    </div>
  );
}

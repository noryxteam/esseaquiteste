"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { QuickNote } from "@/lib/mock-data/reunioes-types";
import { Button } from "@/components/ui/button-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import { Input } from "@/components/ui/input-shadcn";
import { useFeedback } from "@/contexts/feedback-context";

interface QuickNotesCardProps {
  notes: QuickNote[];
}

export function QuickNotesCard({ notes }: QuickNotesCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const { showSuccess } = useFeedback();

  return (
    <>
      <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
        <h3 className="text-xs font-medium text-foreground mb-3">Anotações rápidas</h3>
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="flex items-start justify-between gap-2">
              <p className="text-xs text-foreground/80 leading-snug">{note.text}</p>
              <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{note.time}</span>
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-3 w-full h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground justify-start px-0 hover:bg-transparent"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova anotação
        </Button>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setNoteText("");
        }}
        title="Nova anotação"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setModalOpen(false);
                setNoteText("");
              }}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="bg-foreground text-accent-foreground hover:bg-foreground/90"
              disabled={!noteText.trim()}
              onClick={() => {
                setModalOpen(false);
                setNoteText("");
                showSuccess("Anotação salva.");
              }}
            >
              Salvar
            </Button>
          </>
        }
      >
        <Input
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Digite sua anotação..."
          className="h-9 text-xs bg-surface-inset border-border-subtle"
        />
      </AppModal>
    </>
  );
}

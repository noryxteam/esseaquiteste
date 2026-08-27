"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { NoteItem } from "@/lib/mock-data/types";
import { Button } from "@/components/ui/button-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import { Input } from "@/components/ui/input-shadcn";
import { useFeedback } from "@/contexts/feedback-context";

interface NotesWidgetProps {
  items: NoteItem[];
}

export function NotesWidget({ items }: NotesWidgetProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const { showSuccess } = useFeedback();

  const handleSave = () => {
    showSuccess(content ? "Anotação salva com sucesso." : "Anotação criada com sucesso.");
    setContent("");
    setOpen(false);
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-surface p-4 hover:border-border-strong transition-colors">
        <p className="text-sm font-medium mb-4">Anotações rápidas</p>
        <ul className="space-y-3">
          {items.map((note) => (
            <li key={note.id} className="group">
              <p className="text-sm text-foreground-secondary leading-relaxed">{note.content}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{note.createdAt}</p>
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova anotação
        </Button>
      </div>

      <AppModal
        open={open}
        onClose={() => setOpen(false)}
        title="Nova anotação"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-foreground text-accent-foreground">
              Salvar
            </Button>
          </>
        }
      >
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva sua anotação..."
          className="h-9 text-xs bg-surface-inset border-border-subtle"
        />
      </AppModal>
    </>
  );
}

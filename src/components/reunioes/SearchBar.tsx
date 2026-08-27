"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { Button } from "@/components/ui/button-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import { useFeedback } from "@/contexts/feedback-context";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ value = "", onChange }: SearchBarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { showInfo } = useFeedback();

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Buscar reuniões, projetos, participantes..."
            className="pl-9 h-10 bg-surface-inset border-border-subtle"
          />
        </div>
        <Button
          className="h-10 px-4 bg-foreground text-accent-foreground hover:bg-foreground/90 shrink-0"
          onClick={() => setModalOpen(true)}
        >
          + Nova reunião
        </Button>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova reunião"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              className="bg-foreground text-accent-foreground hover:bg-foreground/90"
              onClick={() => {
                setModalOpen(false);
                showInfo("Agendamento de reunião em breve.");
              }}
            >
              Agendar
            </Button>
          </>
        }
      >
        <p className="text-xs text-muted-foreground">
          Formulário de agendamento em desenvolvimento. Em breve você poderá criar reuniões diretamente por aqui.
        </p>
      </AppModal>
    </>
  );
}

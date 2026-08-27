"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { Button } from "@/components/ui/button-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import { useFeedback } from "@/contexts/feedback-context";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { showSuccess } = useFeedback();

  const handleSave = () => {
    showSuccess(name ? `Projeto "${name}" criado com sucesso.` : "Projeto criado com sucesso.");
    setName("");
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar projetos, clientes, responsáveis..."
            className="pl-9 h-10 bg-surface-inset border-border-subtle"
          />
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="h-10 px-4 bg-foreground text-accent-foreground hover:bg-foreground/90 shrink-0"
        >
          + Novo projeto
        </Button>
      </div>

      <AppModal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo projeto"
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
        <div className="space-y-3">
          <div>
            <label htmlFor="project-name" className="text-xs text-muted-foreground">
              Nome do projeto
            </label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Redesign do site"
              className="mt-1 h-9 text-xs bg-surface-inset border-border-subtle"
            />
          </div>
          <div>
            <label htmlFor="project-client" className="text-xs text-muted-foreground">
              Cliente
            </label>
            <Input
              id="project-client"
              placeholder="Selecione um cliente"
              className="mt-1 h-9 text-xs bg-surface-inset border-border-subtle"
            />
          </div>
        </div>
      </AppModal>
    </>
  );
}

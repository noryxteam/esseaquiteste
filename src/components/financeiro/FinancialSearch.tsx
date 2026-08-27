"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input-shadcn";
import { Button } from "@/components/ui/button-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import { useFeedback } from "@/contexts/feedback-context";

interface FinancialSearchProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function FinancialSearch({ value = "", onChange }: FinancialSearchProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { showSuccess } = useFeedback();

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Buscar receitas, despesas, contratos ou clientes..."
            className="pl-9 h-10 bg-surface-inset border-border-subtle"
          />
        </div>
        <Button
          className="h-10 px-4 bg-foreground text-accent-foreground hover:bg-foreground/90 shrink-0"
          onClick={() => setModalOpen(true)}
        >
          + Nova receita
        </Button>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova receita"
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
                showSuccess("Receita registrada.");
              }}
            >
              Registrar
            </Button>
          </>
        }
      >
        <p className="text-xs text-muted-foreground">
          Formulário de registro de receita em desenvolvimento.
        </p>
      </AppModal>
    </>
  );
}

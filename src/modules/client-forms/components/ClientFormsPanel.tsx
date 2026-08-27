"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Send, Trash2 } from "lucide-react";
import type { ClientForm } from "@/modules/client-forms/types";
import * as formsStore from "@/modules/client-forms/store";
import { FormStatusBadge } from "@/modules/client-forms/components/FormStatusBadge";
import { FormEditor } from "@/modules/client-forms/components/FormEditor";
import { FormResponsesView } from "@/modules/client-forms/components/FormResponsesView";
import { Button } from "@/components/ui/button-shadcn";
import { useAppState } from "@/contexts/app-context";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";

interface ClientFormsPanelProps {
  clientId: string;
}

type Mode = "list" | "edit" | "responses";

export function ClientFormsPanel({ clientId }: ClientFormsPanelProps) {
  const { version, invalidate } = useAppState();
  const { showInfo, showSuccess } = useFeedback();
  const [mode, setMode] = useState<Mode>("list");
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  // Publica formulários já enviados no banco (1x por sessão do painel — evita flood na API)
  useEffect(() => {
    const key = `norax.forms.synced.${clientId}`;
    try {
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
    } catch {
      // ignore
    }
    formsStore.syncAllFormsInBackground();
  }, [clientId]);

  const forms = useMemo(
    () => formsStore.listFormsByClient(clientId),
    [clientId, version, mode]
  );

  const pendingCount = useMemo(
    () => formsStore.countUnreviewedResponses(clientId),
    [clientId, version, mode]
  );

  const handleCreate = () => {
    const form = formsStore.createForm(clientId, "Novo formulário");
    invalidate();
    setActiveFormId(form.id);
    setMode("edit");
  };

  const handleDelete = (form: ClientForm) => {
    const ok = window.confirm(`Excluir o formulário "${form.title}"?`);
    if (!ok) return;
    formsStore.deleteForm(form.id);
    invalidate();
    showSuccess("Formulário excluído.");
  };

  const handleCopyLink = (form: ClientForm) => {
    const url = formsStore.getPublicFormUrl(form.slug);
    try {
      void navigator.clipboard.writeText(url);
      showSuccess("Link copiado.");
    } catch {
      showInfo(url);
    }
  };

  if (mode === "edit" && activeFormId) {
    return (
      <FormEditor
        formId={activeFormId}
        clientId={clientId}
        onClose={() => {
          setMode("list");
          setActiveFormId(null);
          invalidate();
        }}
        onSent={() => {
          invalidate();
        }}
      />
    );
  }

  if (mode === "responses" && activeFormId) {
    return (
      <FormResponsesView
        formId={activeFormId}
        onBack={() => {
          setMode("list");
          setActiveFormId(null);
          invalidate();
        }}
      />
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-foreground">Formulários</h2>
            {pendingCount > 0 && (
              <span className="text-[10px] rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5">
                {pendingCount} resposta{pendingCount > 1 ? "s" : ""} pendente
                {pendingCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Crie e gerencie formulários exclusivos deste cliente.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="h-8 text-xs bg-foreground text-accent-foreground"
          onClick={handleCreate}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Novo formulário
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="px-4 py-14 text-center">
          <p className="text-sm text-muted-foreground">Nenhum formulário ainda</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Crie um formulário em branco e monte com os componentes.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-4 h-8 text-xs bg-foreground text-accent-foreground"
            onClick={handleCreate}
          >
            + Criar formulário
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border-subtle">
          {forms.map((form) => {
            const responses = formsStore.listResponsesByForm(form.id);
            return (
              <li
                key={form.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5",
                  "hover:bg-surface-hover/40 transition-colors"
                )}
              >
                <button
                  type="button"
                  className="text-left min-w-0 flex-1"
                  onClick={() => {
                    setActiveFormId(form.id);
                    setMode("edit");
                  }}
                >
                  <p className="text-sm font-medium text-foreground truncate">{form.title}</p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    <FormStatusBadge status={form.status} />
                    {responses.length > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        {responses.length} resposta{responses.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </button>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      setActiveFormId(form.id);
                      setMode("edit");
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  {form.status !== "draft" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs gap-1"
                      onClick={() => handleCopyLink(form)}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Link
                    </Button>
                  )}
                  {responses.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs gap-1"
                      onClick={() => {
                        setActiveFormId(form.id);
                        setMode("responses");
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Respostas
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                    onClick={() => handleDelete(form)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

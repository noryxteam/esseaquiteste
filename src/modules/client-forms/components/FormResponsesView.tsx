"use client";

import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import * as formsStore from "@/modules/client-forms/store";
import { isAnswerBlock } from "@/modules/client-forms/types";
import { Button } from "@/components/ui/button-shadcn";
import { useAppState } from "@/contexts/app-context";
import { useFeedback } from "@/contexts/feedback-context";

interface FormResponsesViewProps {
  formId: string;
  onBack: () => void;
}

export function FormResponsesView({ formId, onBack }: FormResponsesViewProps) {
  const { invalidate } = useAppState();
  const { showSuccess } = useFeedback();
  const form = formsStore.getForm(formId);
  const responses = useMemo(() => formsStore.listResponsesByForm(formId), [formId]);

  if (!form) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted-foreground">
        Formulário não encontrado.
      </div>
    );
  }

  const answerBlocks = form.blocks.filter((b) => isAnswerBlock(b.type));

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1 -ml-2" onClick={onBack}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Button>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{form.title}</p>
          <p className="text-xs text-muted-foreground">
            {responses.length} resposta{responses.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground">
          Nenhuma resposta recebida ainda.
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {responses.map((resp) => (
            <div key={resp.id} className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Recebida em{" "}
                  {new Date(resp.submittedAt).toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </p>
                {!resp.reviewed && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => {
                      formsStore.markResponseReviewed(resp.id);
                      invalidate();
                      showSuccess("Marcada como vista.");
                    }}
                  >
                    Marcar como vista
                  </Button>
                )}
              </div>
              <dl className="space-y-2.5">
                {answerBlocks.map((block) => {
                  const raw = resp.answers[block.id];
                  const display = Array.isArray(raw)
                    ? raw.join(", ")
                    : raw == null || raw === ""
                      ? "—"
                      : String(raw);
                  return (
                    <div key={block.id} className="text-xs">
                      <dt className="text-muted-foreground">
                        {block.label || "(sem pergunta)"}
                      </dt>
                      <dd className="mt-0.5 text-foreground whitespace-pre-wrap">{display}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

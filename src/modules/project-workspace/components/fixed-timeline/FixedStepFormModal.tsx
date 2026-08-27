"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button-shadcn";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { AppModal } from "@/components/ui/app-modal";
import type { TimelineStep } from "@/modules/project-workspace/types";
import { canCompleteFixedStep } from "@/modules/project-workspace/fixed-timeline";
import {
  saveFixedStepCompletion,
  type FixedStepFormPayload,
} from "@/modules/project-workspace/store";
import { getCompletedCenterLabel } from "@/modules/project-workspace/timeline-copy";
import { useFeedback } from "@/contexts/feedback-context";

interface FixedStepFormModalProps {
  open: boolean;
  step: TimelineStep | null;
  steps: TimelineStep[];
  projectId: string;
  userName: string;
  onClose: () => void;
}

function toDateInput(iso: string | null): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function toTimeInput(iso: string | null): string {
  if (!iso) {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "12:00";
  }
}

export function FixedStepFormModal({
  open,
  step,
  steps,
  projectId,
  userName,
  onClose,
}: FixedStepFormModalProps) {
  const { showSuccess, showInfo } = useFeedback();
  const [form, setForm] = useState<FixedStepFormPayload>({
    date: toDateInput(null),
    time: toTimeInput(null),
    description: "",
    notes: "",
  });

  useEffect(() => {
    if (!step) return;
    const fallback =
      step.fixedKey && !step.description
        ? getCompletedCenterLabel(step.fixedKey)
        : step.description || (step.fixedKey ? getCompletedCenterLabel(step.fixedKey) : "");
    setForm({
      date: toDateInput(step.completedAt),
      time: toTimeInput(step.completedAt),
      description: fallback,
      notes: step.notes || "",
    });
  }, [step]);

  if (!step) return null;

  const gate = canCompleteFixedStep(steps, step.id);
  const alreadyDone = step.status === "completed";

  const handleSave = () => {
    if (!alreadyDone && !gate.ok) {
      showInfo(gate.message ?? "Conclua primeiro a etapa anterior para continuar o fluxo do projeto.");
      return;
    }
    if (!form.description.trim()) {
      showInfo("Informe a descrição da etapa.");
      return;
    }

    const result = saveFixedStepCompletion(projectId, step.id, form, userName);
    if (!result.ok) {
      showInfo(result.message);
      return;
    }
    if (result.progressSuggestion?.applied) {
      const { min, max, progress } = result.progressSuggestion;
      showSuccess(
        `Etapa "${step.name}" concluída. Progresso ajustado para ${progress}% (faixa sugerida ${min}–${max}%).`
      );
    } else if (result.progressSuggestion) {
      const { min, max } = result.progressSuggestion;
      showSuccess(
        `Etapa "${step.name}" atualizada. Faixa sugerida de progresso: ${min}–${max}% — ajuste o slider se quiser.`
      );
    } else {
      showSuccess(`Etapa "${step.name}" atualizada.`);
    }
    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={step.name}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size="sm"
            className="bg-foreground text-accent-foreground"
            onClick={handleSave}
            disabled={!alreadyDone && !gate.ok}
          >
            {alreadyDone ? "Salvar alterações" : "Concluir etapa"}
          </Button>
        </>
      }
    >
      {!alreadyDone && !gate.ok ? (
        <p className="text-xs text-muted-foreground mb-4 rounded-lg border border-border-subtle bg-surface/50 px-3 py-2.5">
          {gate.message}
        </p>
      ) : null}

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data">
            <DatePicker
              value={form.date}
              onChange={(date) =>
                setForm((f) => ({ ...f, date: date || new Date().toISOString().slice(0, 10) }))
              }
            />
          </Field>
          <Field label="Hora">
            <TimePicker
              value={form.time}
              onChange={(time) => setForm((f) => ({ ...f, time }))}
            />
          </Field>
        </div>
        <Field label="Descrição">
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="O que aconteceu nesta etapa..."
            className="w-full rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-border resize-y"
          />
        </Field>
        <Field label="Observações (opcional)">
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            placeholder="Notas internas..."
            className="w-full rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-border resize-y"
          />
        </Field>
      </div>
    </AppModal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

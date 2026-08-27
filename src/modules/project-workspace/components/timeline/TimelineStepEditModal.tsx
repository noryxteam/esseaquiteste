"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import type { StageCategory, TimelineStep } from "@/modules/project-workspace/types";
import { STAGE_CATEGORY_LABELS } from "@/modules/project-workspace/types";

const EDIT_CATEGORIES: StageCategory[] = [
  "desenvolvimento",
  "design",
  "financeiro",
  "marketing",
  "comercial",
  "infraestrutura",
  "entrega",
  "sistema",
  "personalizadas",
];

export interface TimelineStepEditValues {
  name: string;
  description: string;
  notes: string;
  category: StageCategory;
  responsibleName: string;
  status: TimelineStep["status"];
  visibleToClient: boolean;
}

interface TimelineStepEditModalProps {
  open: boolean;
  step: TimelineStep | null;
  onClose: () => void;
  onSave: (values: TimelineStepEditValues) => void;
}

export function TimelineStepEditModal({ open, step, onClose, onSave }: TimelineStepEditModalProps) {
  const [values, setValues] = useState<TimelineStepEditValues | null>(null);

  useEffect(() => {
    if (!step) {
      setValues(null);
      return;
    }
    setValues({
      name: step.name,
      description: step.description,
      notes: step.notes,
      category: step.category,
      responsibleName: step.responsibleName ?? "",
      status: step.status,
      visibleToClient: step.visibleToClient,
    });
  }, [step]);

  if (!values) return null;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Editar etapa"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size="sm"
            className="bg-foreground text-accent-foreground"
            onClick={() => onSave(values)}
          >
            Salvar
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Field label="Nome">
          <Input
            value={values.name}
            onChange={(e) => setValues((v) => (v ? { ...v, name: e.target.value } : v))}
            className="h-9 text-xs bg-surface-inset border-border-subtle"
          />
        </Field>
        <Field label="Descrição">
          <textarea
            value={values.description}
            onChange={(e) => setValues((v) => (v ? { ...v, description: e.target.value } : v))}
            rows={2}
            className="w-full rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-border resize-y"
          />
        </Field>
        <Field label="Observações">
          <textarea
            value={values.notes}
            onChange={(e) => setValues((v) => (v ? { ...v, notes: e.target.value } : v))}
            rows={2}
            className="w-full rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-border resize-y"
          />
        </Field>
        <Field label="Categoria">
          <select
            value={values.category}
            onChange={(e) =>
              setValues((v) =>
                v ? { ...v, category: e.target.value as StageCategory } : v
              )
            }
            className="w-full h-9 rounded-md border border-border-subtle bg-surface-inset px-2 text-xs text-foreground"
          >
            {EDIT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {STAGE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Responsável">
          <Input
            value={values.responsibleName}
            onChange={(e) =>
              setValues((v) => (v ? { ...v, responsibleName: e.target.value } : v))
            }
            placeholder="Nome do responsável"
            className="h-9 text-xs bg-surface-inset border-border-subtle"
          />
        </Field>
        <Field label="Status">
          <select
            value={values.status}
            onChange={(e) =>
              setValues((v) =>
                v ? { ...v, status: e.target.value as TimelineStep["status"] } : v
              )
            }
            className="w-full h-9 rounded-md border border-border-subtle bg-surface-inset px-2 text-xs text-foreground"
          >
            <option value="pending">Pendente</option>
            <option value="completed">Concluída</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-xs text-foreground/80">
          <input
            type="checkbox"
            checked={values.visibleToClient}
            onChange={(e) =>
              setValues((v) => (v ? { ...v, visibleToClient: e.target.checked } : v))
            }
            className="h-3.5 w-3.5 rounded border-border-subtle accent-foreground"
          />
          Visível no portal do cliente (estrutura preparada)
        </label>
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

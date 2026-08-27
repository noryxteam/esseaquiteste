"use client";

import { motion } from "framer-motion";
import { Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import type { TimelineStep } from "@/modules/project-workspace/types";
import { STAGE_CATEGORY_LABELS } from "@/modules/project-workspace/types";
import { formatDateBR, formatTimeBR } from "@/modules/project-workspace/utils";
import { TimelineStepMenu } from "@/modules/project-workspace/components/timeline/TimelineStepMenu";

interface TimelineStepCardProps {
  step: TimelineStep;
  index: number;
  total: number;
  readOnly?: boolean;
  onComplete: () => void;
  onReopen: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

export function TimelineStepCard({
  step,
  index,
  total,
  readOnly,
  onComplete,
  onReopen,
  onEdit,
  onDuplicate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
}: TimelineStepCardProps) {
  const done = step.status === "completed";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="relative flex gap-3 pb-5 last:pb-0"
      draggable={!readOnly}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
    >
      {index < total - 1 && (
        <span className="absolute left-[27px] top-8 bottom-0 w-px bg-border-subtle" aria-hidden />
      )}

      {!readOnly && (
        <button
          type="button"
          className="mt-2 h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing shrink-0"
          aria-label="Arrastar para reordenar"
          tabIndex={-1}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      <div
        className={cn(
          "relative z-[1] mt-1.5 h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-colors",
          done
            ? "bg-foreground border-foreground text-accent-foreground"
            : "bg-surface border-border-subtle text-muted-foreground"
        )}
      >
        {done ? (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3.5 w-3.5" />
          </motion.span>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        )}
      </div>

      <div
        className={cn(
          "flex-1 min-w-0 rounded-lg border px-3 py-2.5 transition-colors",
          done
            ? "border-border bg-surface/30"
            : "border-border-subtle bg-surface/50 hover:border-border"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm font-medium", done && "text-foreground/80")}>{step.name}</p>
            {step.description ? (
              <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            ) : null}
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
              <span>{done ? "Concluída" : "Pendente"}</span>
              <span>{STAGE_CATEGORY_LABELS[step.category] ?? step.category}</span>
              <span>Criada: {formatDateBR(step.createdAt)}</span>
              {step.completedAt && (
                <>
                  <span>
                    Concluída: {formatDateBR(step.completedAt)} {formatTimeBR(step.completedAt)}
                  </span>
                  {step.completedByName && <span>{step.completedByName}</span>}
                </>
              )}
              {step.responsibleName && <span>Resp.: {step.responsibleName}</span>}
            </div>
            {step.notes ? (
              <p className="mt-2 text-[11px] text-foreground/70 border-t border-border-subtle pt-2">
                {step.notes}
              </p>
            ) : null}
          </div>

          {!readOnly && (
            <div className="flex items-center gap-1 shrink-0">
              <TimelineStepMenu onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
              {done ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] border-border-subtle"
                  onClick={onReopen}
                >
                  Reabrir
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-[10px] bg-foreground text-accent-foreground"
                  onClick={onComplete}
                >
                  Concluir
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}

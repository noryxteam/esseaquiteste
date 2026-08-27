"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { useOverlayChrome } from "@/contexts/overlay-chrome-context";
import { STAGE_LIBRARY } from "@/modules/project-workspace/library/stage-library";
import { useStageLibrarySelection } from "@/modules/project-workspace/hooks/use-stage-library-selection";
import { StageLibraryCard } from "@/modules/project-workspace/components/library/StageLibraryCard";
import { StageLibraryCategories } from "@/modules/project-workspace/components/library/StageLibraryCategories";
import type { StageCategory } from "@/modules/project-workspace/types";

interface StageLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (libraryIds: string[]) => void;
}

export function StageLibraryModal({ open, onClose, onAdd }: StageLibraryModalProps) {
  const { setOverlayOpen } = useOverlayChrome();
  const [category, setCategory] = useState<StageCategory>("todos");
  const { selectedIds, count, toggle, clear, isSelected } = useStageLibrarySelection();

  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      setOverlayOpen(false);
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, onClose, setOverlayOpen]);

  useEffect(() => {
    if (!open) clear();
  }, [open, clear]);

  const stages = useMemo(() => {
    if (category === "todos") return STAGE_LIBRARY;
    if (category === "personalizadas") return [];
    return STAGE_LIBRARY.filter((s) => s.category === category);
  }, [category]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[190] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stage-library-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-[1] flex w-full max-w-4xl max-h-[88vh] flex-col rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border-subtle shrink-0">
              <div>
                <h2 id="stage-library-title" className="text-base font-semibold text-foreground">
                  Biblioteca de Etapas
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Selecione etapas prontas para adicionar à timeline.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-5 py-3 border-b border-border-subtle shrink-0">
              <StageLibraryCategories active={category} onChange={setCategory} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
              {stages.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-12">
                  Nenhuma etapa nesta categoria. Use &quot;Nova etapa&quot; para criar personalizadas.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {stages.map((stage) => (
                    <StageLibraryCard
                      key={stage.id}
                      stage={stage}
                      selected={isSelected(stage.id)}
                      onToggle={() => toggle(stage.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-border-subtle shrink-0">
              <p className="text-xs text-muted-foreground tabular-nums">
                {count} etapa{count === 1 ? "" : "s"} selecionada{count === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs border-border-subtle"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={count === 0}
                  className="h-9 text-xs bg-foreground text-accent-foreground disabled:opacity-40"
                  onClick={() => {
                    onAdd(selectedIds);
                    clear();
                    onClose();
                  }}
                >
                  Adicionar etapas
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

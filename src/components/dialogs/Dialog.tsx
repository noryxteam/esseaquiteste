"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/** Dialog base — fade + scale sutil. */
export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative w-full max-w-md rounded-xl border border-border-subtle bg-surface p-5 shadow-2xl",
              className
            )}
          >
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            <div className={cn(title || description ? "mt-4" : "")}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "default" | "danger";
}

export function AlertDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  variant = "default",
}: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={message}>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onClose} className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-hover transition-colors">
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => { onConfirm?.(); onClose(); }}
          className={cn(
            "h-8 px-3 text-xs rounded-lg transition-colors",
            variant === "danger"
              ? "bg-state-red/90 text-white hover:bg-state-red"
              : "bg-foreground text-accent-foreground hover:bg-foreground/90"
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}

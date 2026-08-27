"use client";

import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

export type DrawerSide = "left" | "right";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: DrawerSide;
  width?: string;
  showClose?: boolean;
  className?: string;
}

const SLIDE_VARIANTS = {
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  width = "max-w-[400px]",
  showClose = true,
  className,
}: DrawerProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const slide = SLIDE_VARIANTS[side];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal
            aria-labelledby={title ? titleId : undefined}
            initial={slide.initial}
            animate={slide.animate}
            exit={slide.exit}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className={cn(
              "fixed top-0 z-50 h-full w-full border-border-subtle bg-background flex flex-col",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
              width,
              className
            )}
          >
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border-subtle shrink-0">
                <div className="min-w-0">
                  {title && (
                    <h2 id={titleId} className="text-sm font-medium text-foreground truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
                  )}
                </div>
                {showClose && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={onClose}
                    aria-label="Fechar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer && (
              <div className="flex items-center gap-2 px-5 py-4 border-t border-border-subtle shrink-0">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

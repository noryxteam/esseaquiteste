"use client";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface OpeningContractOverlayProps {
  open: boolean;
  title?: string;
  description?: string;
  /** sparkles = estilo "Criando o contrato"; spinner = carregamento genérico */
  variant?: "sparkles" | "spinner";
}

/** Fundo fosco + card central enquanto uma ação de contrato conclui. */
export function OpeningContractOverlay({
  open,
  title = "Abrindo o contrato",
  description = "Aguarde um momento…",
  variant = "spinner",
}: OpeningContractOverlayProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <motion.div
        className="max-w-md px-6 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto mb-5 h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
          {variant === "sparkles" ? (
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          )}
        </div>
        <p className="text-lg sm:text-xl font-medium text-white tracking-tight">{title}</p>
        <p className="mt-3 text-sm text-white/60 leading-relaxed">{description}</p>
        <div className="mt-8 mx-auto h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

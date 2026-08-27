"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

interface ClientPortalBannerProps {
  onDetails?: () => void;
}

export function ClientPortalBanner({ onDetails }: ClientPortalBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12 }}
      className="portal-card rounded-xl border px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-8 w-8 rounded-lg border portal-ring flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4 portal-fg" />
        </div>
        <p className="text-sm portal-fg leading-relaxed">
          Seu projeto está em andamento! Estamos trabalhando para entregar a melhor solução para
          você.
        </p>
      </div>
      {onDetails ? (
        <button
          type="button"
          onClick={onDetails}
          className="inline-flex items-center gap-1 text-xs font-medium portal-fg shrink-0 hover:opacity-80 transition-opacity"
        >
          Ver detalhes do projeto
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </motion.div>
  );
}

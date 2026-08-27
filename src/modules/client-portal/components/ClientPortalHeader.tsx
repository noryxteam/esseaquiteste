"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { ClientPortalThemeToggle } from "@/modules/client-portal/components/ClientPortalThemeToggle";
import { ClientPortalProgress } from "@/modules/client-portal/components/ClientPortalProgress";

interface ClientPortalHeaderProps {
  projectName: string;
  clientName: string;
  statusLabel: string;
  dueDate: string;
  progress: number;
  clientInitials: string;
  onClose?: () => void;
}

export function ClientPortalHeader({
  projectName,
  clientName,
  statusLabel,
  dueDate,
  progress,
  clientInitials,
  onClose,
}: ClientPortalHeaderProps) {
  return (
    <header className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase portal-fg">Norax</p>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs portal-muted hover:portal-fg transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Dúvidas? Fale conosco
          </button>
          <ClientPortalThemeToggle />
          <div className="h-8 w-8 rounded-full border portal-ring flex items-center justify-center text-[10px] font-medium portal-fg">
            {clientInitials}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] portal-muted hover:portal-fg transition-colors ml-1"
            >
              Fechar
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight portal-fg">
            {projectName}
          </h1>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Meta
              icon={Building2}
              label="Cliente"
              value={clientName}
            />
            <Meta
              icon={Sparkles}
              label="Status atual"
              value={statusLabel}
            />
            <Meta
              icon={Calendar}
              label="Entrega prevista"
              value={dueDate}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <ClientPortalProgress
            value={progress}
            updatedLabel="Atualizado automaticamente pelo sistema"
          />
        </motion.div>
      </div>
    </header>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 h-7 w-7 rounded-md border portal-ring flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 portal-muted" />
      </div>
      <div>
        <p className="text-[10px] portal-muted uppercase tracking-wider">{label}</p>
        <p className="mt-0.5 text-sm portal-fg">{value}</p>
      </div>
    </div>
  );
}

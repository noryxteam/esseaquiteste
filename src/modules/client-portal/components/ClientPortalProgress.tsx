"use client";

import { cn } from "@/lib/utils";

interface ClientPortalProgressProps {
  value: number;
  updatedLabel?: string;
}

/**
 * Progresso somente leitura para o cliente.
 * Sem animação de subida — mostra o valor já salvo pela equipe.
 */
export function ClientPortalProgress({ value, updatedLabel }: ClientPortalProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="portal-card rounded-xl border p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] portal-muted uppercase tracking-wider">Progresso do projeto</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-semibold tabular-nums tracking-tight portal-fg">
              {clamped}%
            </span>
            <span className="text-xs portal-muted">Concluído</span>
          </div>
          <div className="mt-4 h-1.5 rounded-full portal-track overflow-hidden">
            <div
              className="h-full rounded-full portal-bar"
              style={{ width: `${clamped}%` }}
            />
          </div>
          {updatedLabel ? (
            <p className="mt-3 text-[10px] portal-muted">{updatedLabel}</p>
          ) : null}
        </div>
        <div className="hidden sm:flex h-16 w-16 rounded-full border portal-ring items-center justify-center shrink-0">
          <svg
            viewBox="0 0 48 48"
            className="h-10 w-10"
            style={{ color: "var(--portal-fg)", opacity: 0.8 }}
            aria-hidden
          >
            <path
              d="M8 32 C14 28, 18 18, 24 20 C30 22, 32 30, 40 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Barra simples read-only (listas / cards). */
export function StaticProgressBar({
  value,
  className,
  showLabel = true,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden">
        <div className="h-full rounded-full bg-white" style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && (
        <span className="text-[11px] text-foreground/50 tabular-nums w-8 text-right shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
}

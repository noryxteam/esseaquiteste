"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useOverlayChrome } from "@/contexts/overlay-chrome-context";

const STEPS = [
  { id: 1, label: "Cliente" },
  { id: 2, label: "Serviço" },
  { id: 3, label: "Pagamento" },
  { id: 4, label: "Norax" },
  { id: 5, label: "Finalizar" },
];

interface WizardShellProps {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function WizardShell({ step, title, subtitle, children, footer }: WizardShellProps) {
  const { setOverlayOpen } = useOverlayChrome();

  useEffect(() => {
    setOverlayOpen(true);
    return () => setOverlayOpen(false);
  }, [setOverlayOpen]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />
      <div
        role="dialog"
        aria-modal
        className="relative w-full max-w-xl rounded-2xl border border-border-subtle bg-background shadow-2xl overflow-hidden"
      >
        <div className="px-6 pt-6 pb-4 border-b border-border-subtle">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
            Assistente de configuração
          </p>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-5 flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div key={s.id} className="flex-1 flex flex-col gap-1.5">
                <div
                  className={cn(
                    "h-1 rounded-full transition-colors",
                    s.id < step ? "bg-foreground" : s.id === step ? "bg-foreground/70" : "bg-white/10"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] truncate",
                    s.id === step ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 max-h-[55vh] overflow-y-auto">{children}</div>

        <div className="px-6 py-4 border-t border-border-subtle flex justify-between gap-2 bg-surface/40">
          {footer}
        </div>
      </div>
    </div>
  );
}

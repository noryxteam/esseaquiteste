"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

const STEP_MS = 165;
/** Padrão da onda: 1 = ativo (100%), 0 = apagado (~20%) */
const WAVE_FRAMES: number[][] = [
  [1, 0, 0, 0],
  [1, 1, 0, 0],
  [1, 1, 1, 0],
  [1, 1, 1, 1],
  [0, 1, 1, 1],
  [0, 0, 1, 1],
  [0, 0, 0, 1],
];

interface ClientCreatingScreenProps {
  open: boolean;
  phase: "creating" | "error" | "exiting";
  onRetry?: () => void;
}

export function ClientCreatingScreen({ open, phase, onRetry }: ClientCreatingScreenProps) {
  const [frame, setFrame] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || phase !== "creating") return;
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % WAVE_FRAMES.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [open, phase]);

  if (!mounted || !open || typeof document === "undefined") return null;

  const dots = WAVE_FRAMES[frame] ?? WAVE_FRAMES[0];
  const isError = phase === "error";
  const isExiting = phase === "exiting";

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500",
        isExiting ? "opacity-0" : "opacity-100"
      )}
      role="status"
      aria-live="polite"
      aria-busy={phase === "creating"}
    >
      <div className="flex flex-col items-center text-center px-6 max-w-sm">
        {isError ? (
          <>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              Não foi possível criar a ficha.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Algo deu errado ao preparar a estrutura do cliente.
            </p>
            <Button
              type="button"
              className="mt-8 h-10 px-6 bg-foreground text-accent-foreground hover:bg-foreground/90"
              onClick={onRetry}
            >
              Tentar novamente
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              Criando ficha do cliente
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Preparando estrutura...</p>

            <div className="mt-10 flex items-center gap-2.5" aria-hidden>
              {dots.map((active, i) => (
                <span
                  key={i}
                  className="block h-2 w-2 rounded-full bg-white transition-opacity duration-150 ease-out"
                  style={{ opacity: active ? 1 : 0.2 }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

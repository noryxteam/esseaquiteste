"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Info, X } from "lucide-react";

type FeedbackType = "success" | "info";

interface Feedback {
  id: number;
  message: string;
  type: FeedbackType;
}

interface FeedbackContextValue {
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Feedback[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const show = useCallback((message: string, type: FeedbackType) => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const showSuccess = useCallback((message: string) => show(message, "success"), [show]);
  const showInfo = useCallback((message: string) => show(message, "info"), [show]);

  return (
    <FeedbackContext.Provider value={{ showSuccess, showInfo }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg text-xs max-w-sm animate-in slide-in-from-bottom-2",
              item.type === "success"
                ? "border-border-subtle bg-surface text-foreground"
                : "border-border-subtle bg-surface text-foreground"
            )}
          >
            {item.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <Info className="h-4 w-4 shrink-0" />
            )}
            <span className="flex-1">{item.message}</span>
            <button type="button" onClick={() => dismiss(item.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}

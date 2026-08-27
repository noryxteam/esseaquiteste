"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { AppModal } from "@/components/ui/app-modal";
import { ClientCreatingScreen } from "@/components/clientes/ClientCreatingScreen";
import { useFeedback } from "@/contexts/feedback-context";
import { useAppState } from "@/contexts/app-context";
import { useInstantNav } from "@/contexts/instant-nav-context";
import { bootstrapNewClient } from "@/modules/client-setup/bootstrap-client";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface PendingCreate {
  name: string;
  email: string;
}

interface NovoClienteContextValue {
  openNovoCliente: () => void;
}

const NovoClienteContext = createContext<NovoClienteContextValue | null>(null);

export function NovoClienteProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setPendingHref } = useInstantNav();
  const { showInfo } = useFeedback();
  const { invalidate } = useAppState();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [phase, setPhase] = useState<"creating" | "error" | "exiting">("creating");
  const [pending, setPending] = useState<PendingCreate | null>(null);

  const openNovoCliente = useCallback(() => {
    setOpen(true);
  }, []);

  const runBootstrap = useCallback(
    async (payload: PendingCreate) => {
      setPhase("creating");
      setCreating(true);
      try {
        const client = await bootstrapNewClient(payload);
        const href = routes.cliente(client.id);

        // Troca o conteúdo na hora (ficha + wizard) — não volta para a lista
        setPendingHref(href);
        router.push(href);
        invalidate();

        setPhase("exiting");
        await new Promise((r) => setTimeout(r, 420));
        setCreating(false);
        setPending(null);
        setName("");
        setEmail("");
      } catch {
        setPhase("error");
      }
    },
    [invalidate, router, setPendingHref]
  );

  const handleSave = () => {
    if (!name.trim()) {
      showInfo("Informe o nome da empresa.");
      return;
    }
    const payload = { name: name.trim(), email: email.trim() };
    setPending(payload);
    setOpen(false);
    void runBootstrap(payload);
  };

  const handleRetry = () => {
    if (!pending) return;
    void runBootstrap(pending);
  };

  const value = useMemo(() => ({ openNovoCliente }), [openNovoCliente]);

  return (
    <NovoClienteContext.Provider value={value}>
      {children}

      <AppModal
        open={open}
        onClose={() => setOpen(false)}
        title="Novo cliente"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-foreground text-accent-foreground">
              Salvar
            </Button>
          </>
        }
      >
        <form
          className="space-y-3"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label htmlFor="nx-new-client-company" className="text-xs text-muted-foreground">
              Nome da empresa
            </label>
            <Input
              id="nx-new-client-company"
              name="nx-new-client-company"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Infinity Store"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck={false}
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              className="mt-1 h-9 text-xs bg-surface-inset border-border-subtle"
            />
          </div>
          <div>
            <label htmlFor="nx-new-client-contact" className="text-xs text-muted-foreground">
              E-mail de contato
            </label>
            <Input
              id="nx-new-client-contact"
              name="nx-new-client-contact"
              type="text"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@empresa.com"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck={false}
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              className="mt-1 h-9 text-xs bg-surface-inset border-border-subtle"
            />
          </div>
        </form>
      </AppModal>

      <ClientCreatingScreen open={creating} phase={phase} onRetry={handleRetry} />
    </NovoClienteContext.Provider>
  );
}

export function useNovoCliente(): NovoClienteContextValue {
  const ctx = useContext(NovoClienteContext);
  if (!ctx) {
    return { openNovoCliente: () => undefined };
  }
  return ctx;
}

interface NovoClienteButtonProps {
  className?: string;
  label?: string;
}

export function NovoClienteButton({
  className,
  label = "+ Novo cliente",
}: NovoClienteButtonProps) {
  const { openNovoCliente } = useNovoCliente();

  return (
    <Button
      onClick={openNovoCliente}
      className={cn(
        "h-10 px-4 bg-foreground text-accent-foreground hover:bg-foreground/90 shrink-0",
        className
      )}
    >
      {label}
    </Button>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface InstantNavContextValue {
  pendingHref: string | null;
  setPendingHref: (href: string | null) => void;
  /** Rota efetiva para menu + conteúdo (pending ou URL) */
  activeHref: string;
}

const InstantNavContext = createContext<InstantNavContextValue | null>(null);

export function InstantNavProvider({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  const [pendingHref, setPendingHrefState] = useState<string | null>(null);

  const setPendingHref = useCallback((href: string | null) => {
    setPendingHrefState(href);
  }, []);

  useEffect(() => {
    if (!pendingHref) return;
    if (pathname === pendingHref || pathname.startsWith(`${pendingHref}/`)) {
      setPendingHrefState(null);
    }
  }, [pathname, pendingHref]);

  const activeHref = pendingHref ?? pathname;

  const value = useMemo(
    () => ({ pendingHref, setPendingHref, activeHref }),
    [pendingHref, setPendingHref, activeHref]
  );

  return (
    <InstantNavContext.Provider value={value}>{children}</InstantNavContext.Provider>
  );
}

export function useInstantNav() {
  const ctx = useContext(InstantNavContext);
  if (!ctx) {
    return {
      pendingHref: null as string | null,
      setPendingHref: (_href: string | null) => undefined,
      activeHref: "",
    };
  }
  return ctx;
}

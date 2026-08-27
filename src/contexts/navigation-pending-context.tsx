"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface NavigationPendingContextValue {
  pendingPath: string | null;
  setPendingPath: (path: string | null) => void;
}

const NavigationPendingContext = createContext<NavigationPendingContextValue | null>(null);

export function NavigationPendingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [pendingPath, setPendingPathState] = useState<string | null>(null);

  const setPendingPath = useCallback((path: string | null) => {
    setPendingPathState(path);
  }, []);

  useEffect(() => {
    setPendingPathState(null);
  }, [pathname]);

  const value = useMemo(
    () => ({ pendingPath, setPendingPath }),
    [pendingPath, setPendingPath]
  );

  return (
    <NavigationPendingContext.Provider value={value}>{children}</NavigationPendingContext.Provider>
  );
}

export function useNavigationPending() {
  const ctx = useContext(NavigationPendingContext);
  if (!ctx) throw new Error("useNavigationPending deve ser usado dentro de NavigationPendingProvider");
  return ctx;
}

export function useNavigationPendingOptional() {
  return useContext(NavigationPendingContext);
}

interface RouteContentGateProps {
  children: React.ReactNode;
}

/**
 * Sempre renderiza a página atual.
 * Não trocar por skeleton — isso desmontava a rota e a tela ficava presa na página antiga.
 */
export function RouteContentGate({ children }: RouteContentGateProps) {
  return <>{children}</>;
}

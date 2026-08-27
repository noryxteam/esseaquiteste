"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface OverlayChromeContextValue {
  overlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
}

const OverlayChromeContext = createContext<OverlayChromeContextValue | null>(null);

export function OverlayChromeProvider({ children }: { children: ReactNode }) {
  const [overlayOpen, setOverlayOpenState] = useState(false);
  const setOverlayOpen = useCallback((open: boolean) => {
    setOverlayOpenState(open);
  }, []);

  const value = useMemo(
    () => ({ overlayOpen, setOverlayOpen }),
    [overlayOpen, setOverlayOpen]
  );

  return (
    <OverlayChromeContext.Provider value={value}>{children}</OverlayChromeContext.Provider>
  );
}

export function useOverlayChrome(): OverlayChromeContextValue {
  const ctx = useContext(OverlayChromeContext);
  if (!ctx) {
    return { overlayOpen: false, setOverlayOpen: () => undefined };
  }
  return ctx;
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PortalTheme } from "@/modules/client-portal/types";

interface PortalThemeContextValue {
  theme: PortalTheme;
  toggle: () => void;
  transitioning: boolean;
}

const PortalThemeContext = createContext<PortalThemeContextValue | null>(null);

export function usePortalTheme() {
  const ctx = useContext(PortalThemeContext);
  if (!ctx) throw new Error("usePortalTheme must be used within PortalThemeProvider");
  return ctx;
}

export function PortalThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PortalTheme>("dark");
  const [transitioning, setTransitioning] = useState(false);

  const toggle = useCallback(() => {
    setTransitioning(true);
    window.setTimeout(() => {
      setTheme((t) => (t === "dark" ? "light" : "dark"));
    }, 120);
    window.setTimeout(() => setTransitioning(false), 900);
  }, []);

  const value = useMemo(
    () => ({ theme, toggle, transitioning }),
    [theme, toggle, transitioning]
  );

  return (
    <PortalThemeContext.Provider value={value}>
      <div
        data-portal-theme={theme}
        className="portal-root relative min-h-full transition-[background-color,color] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <AnimatePresence>
          {transitioning && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className="absolute inset-0 origin-top"
                style={{
                  background:
                    theme === "dark"
                      ? "radial-gradient(ellipse at top, rgba(245,245,244,0.35), transparent 60%)"
                      : "radial-gradient(ellipse at top, rgba(9,9,11,0.45), transparent 60%)",
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </div>
    </PortalThemeContext.Provider>
  );
}

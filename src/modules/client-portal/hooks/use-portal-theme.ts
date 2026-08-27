"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClientPortalTheme } from "@/modules/client-portal/types";

const STORAGE_KEY = "norax.client-portal.theme";

export function usePortalTheme(initial: ClientPortalTheme = "dark") {
  const [theme, setTheme] = useState<ClientPortalTheme>(initial);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ClientPortalTheme | null;
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTransitioning(true);
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
    window.setTimeout(() => setTransitioning(false), 900);
  }, []);

  return { theme, toggleTheme, transitioning };
}

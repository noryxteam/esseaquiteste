"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { usePortalTheme } from "@/modules/client-portal/components/PortalThemeProvider";

export function ClientPortalThemeToggle() {
  const { theme, toggle, transitioning } = usePortalTheme();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={transitioning}
      whileTap={{ scale: 0.94 }}
      className="portal-icon-btn h-9 w-9 rounded-full border flex items-center justify-center transition-colors duration-500"
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </motion.button>
  );
}

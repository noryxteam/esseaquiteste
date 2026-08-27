"use client";

import { motion } from "framer-motion";

export function ProjectHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">Projetos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Acompanhe todos os projetos em andamento e organize suas entregas.
      </p>
    </motion.div>
  );
}

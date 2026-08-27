"use client";

import { motion } from "framer-motion";
import type { MeetingIntelligenceTab } from "@/lib/mock-data/meeting-intelligence-types";
import { cn } from "@/lib/utils";

const TABS: { id: MeetingIntelligenceTab; label: string }[] = [
  { id: "resumo-ia", label: "Resumo com IA" },
  { id: "transcricao", label: "Transcrição" },
  { id: "analise", label: "Análise detalhada" },
  { id: "briefing", label: "Briefing" },
  { id: "tasks", label: "Tasks geradas" },
  { id: "historico", label: "Histórico" },
];

interface MeetingTabsProps {
  active: MeetingIntelligenceTab;
  onChange: (tab: MeetingIntelligenceTab) => void;
}

export function MeetingTabs({ active, onChange }: MeetingTabsProps) {
  return (
    <div className="flex items-center gap-5 sm:gap-6 border-b border-border-subtle overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative pb-3 text-xs font-medium whitespace-nowrap transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {isActive && (
              <motion.span
                layoutId="meeting-intelligence-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

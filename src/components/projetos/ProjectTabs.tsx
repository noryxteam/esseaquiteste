"use client";

import type { ProjectTab } from "@/lib/mock-data/projetos-types";
import { cn } from "@/lib/utils";

const TABS: { id: ProjectTab; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "em-andamento", label: "Em andamento" },
  { id: "pausados", label: "Pausados" },
  { id: "concluidos", label: "Concluídos" },
];

interface ProjectTabsProps {
  active: ProjectTab;
  onChange: (tab: ProjectTab) => void;
}

export function ProjectTabs({ active, onChange }: ProjectTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
              isActive
                ? "text-foreground bg-surface-elevated border border-border-subtle"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

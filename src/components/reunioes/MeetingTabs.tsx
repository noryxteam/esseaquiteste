"use client";

import type { MeetingTab } from "@/lib/mock-data/reunioes-types";
import { TabUnderline } from "@/components/ui/tab-underline";
import { cn } from "@/lib/utils";

const TABS: { id: MeetingTab; label: string }[] = [
  { id: "agenda", label: "Agenda" },
  { id: "todas", label: "Todas as reuniões" },
  { id: "minhas", label: "Minhas reuniões" },
];

interface MeetingTabsProps {
  active: MeetingTab;
  onChange: (tab: MeetingTab) => void;
}

export function MeetingTabs({ active, onChange }: MeetingTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border-subtle overflow-x-auto">
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
            {isActive && <TabUnderline />}
          </button>
        );
      })}
    </div>
  );
}

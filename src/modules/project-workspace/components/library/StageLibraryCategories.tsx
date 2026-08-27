"use client";

import type { StageCategory } from "@/modules/project-workspace/types";
import { STAGE_CATEGORY_LABELS } from "@/modules/project-workspace/types";
import { cn } from "@/lib/utils";

const FILTERS: StageCategory[] = [
  "todos",
  "desenvolvimento",
  "design",
  "financeiro",
  "marketing",
  "comercial",
  "infraestrutura",
  "entrega",
  "sistema",
  "personalizadas",
];

interface StageLibraryCategoriesProps {
  active: StageCategory;
  onChange: (category: StageCategory) => void;
}

export function StageLibraryCategories({ active, onChange }: StageLibraryCategoriesProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {FILTERS.map((id) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "px-2.5 py-1.5 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors",
              isActive
                ? "text-foreground bg-surface-elevated border border-border-subtle"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
            )}
          >
            {STAGE_CATEGORY_LABELS[id]}
          </button>
        );
      })}
    </div>
  );
}

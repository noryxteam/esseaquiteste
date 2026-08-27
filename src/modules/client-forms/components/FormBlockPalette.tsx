"use client";

import {
  AlignLeft,
  Calendar,
  CheckSquare,
  CircleDot,
  FileUp,
  GripVertical,
  Hash,
  Heading1,
  Info,
  List,
  Minus,
  Space,
  Type,
} from "lucide-react";
import type { FormBlockType } from "@/modules/client-forms/types";
import { BLOCK_PALETTE } from "@/modules/client-forms/types";
import { cn } from "@/lib/utils";

const ICONS: Partial<Record<FormBlockType, typeof Type>> = {
  title: Heading1,
  section: Type,
  text: AlignLeft,
  info: Info,
  short_text: Type,
  long_text: AlignLeft,
  multiple_choice: CircleDot,
  checkbox: CheckSquare,
  select: List,
  date: Calendar,
  number: Hash,
  upload: FileUp,
  divider: Minus,
  spacer: Space,
};

interface FormBlockPaletteProps {
  onAdd: (type: FormBlockType) => void;
}

export function FormBlockPalette({ onAdd }: FormBlockPaletteProps) {
  return (
    <div className="h-full flex flex-col min-h-0">
      <p className="text-xs font-medium text-foreground mb-3 shrink-0">Adicionar campo</p>
      <ul className="space-y-0.5 flex-1 min-h-0 overflow-y-auto pr-0.5">
        {BLOCK_PALETTE.map((item) => {
          const Icon = ICONS[item.type] ?? GripVertical;
          return (
            <li key={item.type}>
              <button
                type="button"
                onClick={() => onAdd(item.type)}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs",
                  "text-muted-foreground hover:text-foreground hover:bg-surface-hover/60 transition-colors"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

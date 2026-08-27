"use client";

import { CONTRACT_TEMPLATES } from "@/modules/contract-builder/templates";
import type { ContractTemplateKind } from "@/modules/contract-builder/types";
import { cn } from "@/lib/utils";

interface ContractTemplatePickerProps {
  value: ContractTemplateKind;
  onChange: (kind: ContractTemplateKind) => void;
}

export function ContractTemplatePicker({ value, onChange }: ContractTemplatePickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">Modelo de contrato</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CONTRACT_TEMPLATES.map((tpl) => (
          <button
            key={tpl.kind}
            type="button"
            onClick={() => onChange(tpl.kind)}
            className={cn(
              "text-left rounded-lg border px-3 py-2.5 transition-colors",
              value === tpl.kind
                ? "border-foreground bg-foreground/10"
                : "border-border-subtle hover:border-border"
            )}
          >
            <p className="text-xs font-medium text-foreground">{tpl.nome}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{tpl.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

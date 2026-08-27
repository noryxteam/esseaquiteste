"use client";

import type { ContractFillableField } from "@/modules/electronic-contracts";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { Plus, Trash2 } from "lucide-react";

interface ContractFieldsProps {
  fields: ContractFillableField[];
  onChange: (fields: ContractFillableField[]) => void;
  readOnly?: boolean;
}

export function ContractFields({ fields, onChange, readOnly }: ContractFieldsProps) {
  const addField = () => {
    onChange([
      ...fields,
      {
        id: `field-${Date.now()}`,
        tipo: "texto",
        label: "Novo campo",
        obrigatorio: true,
      },
    ]);
  };

  const update = (id: string, patch: Partial<ContractFillableField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const remove = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Campos preenchíveis</p>
        {!readOnly && (
          <Button type="button" variant="outline" size="sm" onClick={addField} className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            Campo
          </Button>
        )}
      </div>
      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground py-4 text-center border border-dashed border-border-subtle rounded-lg">
          Nenhum campo adicionado
        </p>
      )}
      <ul className="space-y-2">
        {fields.map((field) => (
          <li
            key={field.id}
            className="flex items-center gap-2 p-3 rounded-lg border border-border-subtle bg-surface/40"
          >
            <Input
              value={field.label}
              onChange={(e) => update(field.id, { label: e.target.value })}
              disabled={readOnly}
              className="h-8 text-sm flex-1"
              placeholder="Rótulo do campo"
            />
            <select
              value={field.tipo}
              onChange={(e) =>
                update(field.id, { tipo: e.target.value as ContractFillableField["tipo"] })
              }
              disabled={readOnly}
              className="h-8 rounded-md border border-border-subtle bg-background px-2 text-xs"
            >
              <option value="texto">Texto</option>
              <option value="data">Data</option>
              <option value="numero">Número</option>
              <option value="assinatura">Assinatura</option>
              <option value="checkbox">Checkbox</option>
            </select>
            {!readOnly && (
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => remove(field.id)}>
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

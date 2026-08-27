"use client";

import { useState } from "react";
import type { ContractClause, ContractEditorSettings } from "@/modules/electronic-contracts";
import { ContractVariables } from "@/components/contracts/ContractVariables";
import { ContractFields } from "@/components/contracts/ContractFields";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { Plus, Trash2 } from "lucide-react";

interface ContractEditorProps {
  clausulas: ContractClause[];
  settings: ContractEditorSettings;
  campos: import("@/modules/electronic-contracts").ContractFillableField[];
  readOnly?: boolean;
  onClausulasChange: (clausulas: ContractClause[]) => void;
  onSettingsChange: (settings: ContractEditorSettings) => void;
  onCamposChange: (campos: import("@/modules/electronic-contracts").ContractFillableField[]) => void;
}

export function ContractEditor({
  clausulas,
  settings,
  campos,
  readOnly,
  onClausulasChange,
  onSettingsChange,
  onCamposChange,
}: ContractEditorProps) {
  const [activeClause, setActiveClause] = useState(0);

  const insertVariable = (variable: string) => {
    if (readOnly || !clausulas[activeClause]) return;
    const updated = [...clausulas];
    const clause = { ...updated[activeClause] };
    const paragraphs = [...clause.paragrafos];
    paragraphs[0] = (paragraphs[0] ?? "") + " " + variable;
    clause.paragrafos = paragraphs;
    updated[activeClause] = clause;
    onClausulasChange(updated);
  };

  const addClause = () => {
    const num = String(clausulas.length + 1).padStart(2, "0");
    onClausulasChange([
      ...clausulas,
      {
        id: `cl-${Date.now()}`,
        numero: num,
        titulo: "NOVA CLÁUSULA",
        paragrafos: [""],
      },
    ]);
    setActiveClause(clausulas.length);
  };

  const updateClause = (index: number, patch: Partial<ContractClause>) => {
    onClausulasChange(clausulas.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const removeClause = (index: number) => {
    onClausulasChange(clausulas.filter((_, i) => i !== index));
    setActiveClause(Math.max(0, index - 1));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Cabeçalho</label>
            <Input
              value={settings.cabecalho ?? ""}
              onChange={(e) => onSettingsChange({ ...settings, cabecalho: e.target.value })}
              disabled={readOnly}
              className="mt-1 h-9"
              placeholder="Cabeçalho do documento"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Rodapé</label>
            <Input
              value={settings.rodape ?? ""}
              onChange={(e) => onSettingsChange({ ...settings, rodape: e.target.value })}
              disabled={readOnly}
              className="mt-1 h-9"
              placeholder="Rodapé do documento"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Cláusulas</p>
          {!readOnly && (
            <Button type="button" variant="outline" size="sm" onClick={addClause} className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              Cláusula
            </Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap border-b border-border-subtle pb-2">
          {clausulas.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveClause(i)}
              className={`px-3 py-1 rounded-md text-xs ${
                activeClause === i
                  ? "bg-foreground text-accent-foreground"
                  : "bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.numero}
            </button>
          ))}
        </div>

        {clausulas[activeClause] && (
          <div className="space-y-3 p-4 rounded-xl border border-border-subtle bg-surface/30">
            <div className="flex gap-2">
              <Input
                value={clausulas[activeClause].titulo}
                onChange={(e) => updateClause(activeClause, { titulo: e.target.value })}
                disabled={readOnly}
                className="h-9 font-medium"
                placeholder="Título da cláusula"
              />
              {!readOnly && clausulas.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeClause(activeClause)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <textarea
              value={clausulas[activeClause].paragrafos.join("\n\n")}
              onChange={(e) =>
                updateClause(activeClause, { paragrafos: e.target.value.split("\n\n") })
              }
              disabled={readOnly}
              rows={8}
              className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm resize-y min-h-[120px]"
              placeholder="Conteúdo da cláusula..."
            />
          </div>
        )}

        <div>
          <label className="text-xs text-muted-foreground">Observações</label>
          <textarea
            value={settings.observacoes ?? ""}
            onChange={(e) => onSettingsChange({ ...settings, observacoes: e.target.value })}
            disabled={readOnly}
            rows={3}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="xl:col-span-4 space-y-6">
        {!readOnly && <ContractVariables onInsert={insertVariable} />}
        <ContractFields fields={campos} onChange={onCamposChange} readOnly={readOnly} />
      </div>
    </div>
  );
}

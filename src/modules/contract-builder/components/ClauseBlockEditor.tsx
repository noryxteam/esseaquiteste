"use client";

import { useState } from "react";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import type { ClauseBlock } from "@/modules/contract-builder/types";
import { formatBlockNumber, renumberBlocks } from "@/modules/contract-builder/templates";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

interface ClauseBlockEditorProps {
  blocks: ClauseBlock[];
  onChange: (blocks: ClauseBlock[]) => void;
  readOnly?: boolean;
}

export function ClauseBlockEditor({ blocks, onChange, readOnly }: ClauseBlockEditorProps) {
  const [dragId, setDragId] = useState<string | null>(null);

  const ordered = renumberBlocks(blocks);

  const update = (next: ClauseBlock[]) => onChange(renumberBlocks(next));

  const addBlock = () => {
    const id = `blk-${Date.now()}`;
    update([
      ...ordered,
      {
        id,
        titulo: "",
        paragrafos: [""],
        ordem: ordered.length,
      },
    ]);
  };

  const duplicate = (id: string) => {
    const src = ordered.find((b) => b.id === id);
    if (!src) return;
    const copy: ClauseBlock = {
      ...src,
      id: `blk-${Date.now()}`,
      titulo: `${src.titulo} (cópia)`,
      paragrafos: [...src.paragrafos],
      ordem: ordered.length,
    };
    update([...ordered, copy]);
  };

  const remove = (id: string) => {
    update(ordered.filter((b) => b.id !== id));
  };

  const onDragStart = (id: string) => setDragId(id);

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...ordered];
    const from = list.findIndex((b) => b.id === dragId);
    const to = list.findIndex((b) => b.id === targetId);
    if (from < 0 || to < 0) return;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    setDragId(null);
    update(list.map((b, i) => ({ ...b, ordem: i })));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Cláusulas</h3>
          <p className="text-[11px] text-muted-foreground">
            Arraste para reordenar. A numeração atualiza automaticamente.
          </p>
        </div>
        {!readOnly && (
          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={addBlock}>
            <Plus className="h-3.5 w-3.5" />
            Nova cláusula
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {ordered.length === 0 && !readOnly ? (
          <div className="rounded-xl border border-dashed border-border-subtle bg-surface/30 px-5 py-10 text-center">
            <p className="text-sm text-foreground">Nenhuma cláusula ainda</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Adicione um título e depois a descrição de cada cláusula.
            </p>
            <Button size="sm" className="mt-4 h-8 gap-1 text-xs bg-foreground text-accent-foreground" onClick={addBlock}>
              <Plus className="h-3.5 w-3.5" />
              Nova cláusula
            </Button>
          </div>
        ) : null}

        {ordered.map((block) => (
          <div
            key={block.id}
            draggable={!readOnly}
            onDragStart={() => onDragStart(block.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(block.id)}
            className={cn(
              "rounded-xl border border-border-subtle bg-surface/50 p-4",
              dragId === block.id && "opacity-60"
            )}
          >
            <div className="flex items-start gap-2">
              {!readOnly && (
                <button
                  type="button"
                  className="mt-1 text-muted-foreground cursor-grab active:cursor-grabbing"
                  aria-label="Arrastar"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                    {formatBlockNumber(block.ordem)}
                  </span>
                  {readOnly ? (
                    <p className="text-sm font-medium">{block.titulo}</p>
                  ) : (
                    <Input
                      value={block.titulo}
                      placeholder="Título da cláusula"
                      onChange={(e) =>
                        update(
                          ordered.map((b) =>
                            b.id === block.id ? { ...b, titulo: e.target.value } : b
                          )
                        )
                      }
                      className="h-8 text-xs font-medium bg-surface-inset border-border-subtle uppercase"
                    />
                  )}
                </div>
                {block.paragrafos.map((p, pi) =>
                  readOnly ? (
                    <p key={pi} className="text-xs text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ) : (
                    <textarea
                      key={pi}
                      value={p}
                      rows={3}
                      placeholder="Descrição / parágrafo da cláusula..."
                      onChange={(e) => {
                        const paragrafos = [...block.paragrafos];
                        paragrafos[pi] = e.target.value;
                        update(
                          ordered.map((b) => (b.id === block.id ? { ...b, paragrafos } : b))
                        );
                      }}
                      className="w-full rounded-lg border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-foreground resize-y placeholder:text-muted-foreground/60"
                    />
                  )
                )}
                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] text-muted-foreground"
                    onClick={() =>
                      update(
                        ordered.map((b) =>
                          b.id === block.id
                            ? { ...b, paragrafos: [...b.paragrafos, ""] }
                            : b
                        )
                      )
                    }
                  >
                    + Parágrafo
                  </Button>
                )}
              </div>
              {!readOnly && (
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => duplicate(block.id)}
                    aria-label="Duplicar"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-state-red"
                    onClick={() => remove(block.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import type { FormBlock } from "@/modules/client-forms/types";
import { isAnswerBlock } from "@/modules/client-forms/types";
import { createOption } from "@/modules/client-forms/block-factory";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";

interface FormBlockItemProps {
  block: FormBlock;
  selected: boolean;
  onSelect: () => void;
  onChange: (block: FormBlock) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function FormBlockItem({
  block,
  selected,
  onSelect,
  onChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: FormBlockItemProps) {
  const showQuestion = isAnswerBlock(block.type);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "rounded-lg border bg-surface/80 p-3 space-y-3 transition-colors cursor-pointer",
        selected ? "border-white/30" : "border-border-subtle hover:border-border"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <GripVertical className="h-3.5 w-3.5" />
          <span className="text-[10px] uppercase tracking-wide">{blockTypeLabel(block.type)}</span>
          {block.isNewField ? (
            <span className="text-[9px] uppercase tracking-wide rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-300 px-1.5 py-0.5">
              Novo
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <IconBtn onClick={onDuplicate} title="Duplicar">
            <Copy className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={onMoveUp} disabled={!canMoveUp} title="Mover para cima">
            <ChevronUp className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={onMoveDown} disabled={!canMoveDown} title="Mover para baixo">
            <ChevronDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn onClick={onDelete} title="Excluir" danger>
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>

      {(block.type === "title") && (
        <input
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Clique para editar"
          className="w-full bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
      )}

      {(block.type === "text" || block.type === "info") && (
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          placeholder="Clique para editar"
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 outline-none"
        />
      )}

      {block.type === "divider" && <div className="border-t border-border-subtle my-1" />}
      {block.type === "spacer" && <div className="h-6" />}

      {showQuestion && (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <input
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Clique para editar a pergunta"
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/50 outline-none"
          />

          {block.type === "short_text" || block.type === "section" ? (
            <div className="rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-muted-foreground/50">
              Resposta curta
            </div>
          ) : null}
          {block.type === "long_text" && (
            <div className="rounded-md border border-border-subtle bg-surface-inset px-3 py-6 text-xs text-muted-foreground/50">
              Resposta longa
            </div>
          )}
          {block.type === "date" && (
            <div className="rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-muted-foreground/50 w-40">
              dd/mm/aaaa
            </div>
          )}
          {block.type === "number" && (
            <div className="rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-muted-foreground/50 w-32">
              0
            </div>
          )}
          {block.type === "upload" && (
            <div className="rounded-md border border-dashed border-border-subtle bg-surface-inset px-3 py-4 text-center text-xs text-muted-foreground/50">
              Upload de arquivos
            </div>
          )}
          {block.type === "select" && (
            <div className="rounded-md border border-border-subtle bg-surface-inset px-3 py-2 text-xs text-muted-foreground/50">
              Selecione…
            </div>
          )}

          {(block.type === "multiple_choice" || block.type === "checkbox") && (
            <ul className="space-y-2">
              {block.options.map((opt, idx) => (
                <li key={opt.id} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 border border-white/25",
                      block.type === "multiple_choice" ? "rounded-full" : "rounded-[3px]"
                    )}
                  />
                  <Input
                    value={opt.label}
                    onChange={(e) => {
                      const options = block.options.map((o) =>
                        o.id === opt.id ? { ...o, label: e.target.value } : o
                      );
                      onChange({ ...block, options });
                    }}
                    className="h-8 text-xs bg-transparent border-transparent hover:border-border-subtle focus:border-border-subtle"
                    placeholder={`Opção ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-red-400 p-1"
                    onClick={() =>
                      onChange({
                        ...block,
                        options: block.options.filter((o) => o.id !== opt.id),
                      })
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </li>
              ))}
              <li>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px] text-muted-foreground gap-1"
                  onClick={() =>
                    onChange({
                      ...block,
                      options: [...block.options, createOption(`Opção ${block.options.length + 1}`)],
                    })
                  }
                >
                  <Plus className="h-3 w-3" />
                  Adicionar opção
                </Button>
              </li>
            </ul>
          )}

          {block.type === "select" && (
            <ul className="space-y-1.5 pt-1">
              {block.options.map((opt, idx) => (
                <li key={opt.id} className="flex items-center gap-2">
                  <Input
                    value={opt.label}
                    onChange={(e) => {
                      const options = block.options.map((o) =>
                        o.id === opt.id ? { ...o, label: e.target.value } : o
                      );
                      onChange({ ...block, options });
                    }}
                    className="h-8 text-xs"
                    placeholder={`Opção ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-red-400 p-1"
                    onClick={() =>
                      onChange({
                        ...block,
                        options: block.options.filter((o) => o.id !== opt.id),
                      })
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </li>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] text-muted-foreground gap-1"
                onClick={() =>
                  onChange({
                    ...block,
                    options: [...block.options, createOption(`Opção ${block.options.length + 1}`)],
                  })
                }
              >
                <Plus className="h-3 w-3" />
                Adicionar opção
              </Button>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 disabled:opacity-30",
        danger && "hover:text-red-400"
      )}
    >
      {children}
    </button>
  );
}

function blockTypeLabel(type: FormBlock["type"]): string {
  const map: Record<FormBlock["type"], string> = {
    title: "Título",
    section: "Pergunta com campo",
    text: "Texto",
    info: "Info",
    short_text: "Texto curto",
    long_text: "Texto longo",
    multiple_choice: "Múltipla escolha",
    checkbox: "Caixa de seleção",
    select: "Lista",
    date: "Data",
    number: "Número",
    upload: "Upload",
    divider: "Divisor",
    spacer: "Espaço",
  };
  return map[type];
}

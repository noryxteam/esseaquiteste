"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Settings2 } from "lucide-react";
import type { ClientForm, FormBlock, FormBlockType } from "@/modules/client-forms/types";
import { createEmptyBlock } from "@/modules/client-forms/block-factory";
import * as formsStore from "@/modules/client-forms/store";
import { FormBlockPalette } from "@/modules/client-forms/components/FormBlockPalette";
import { FormBlockItem } from "@/modules/client-forms/components/FormBlockItem";
import { FormStatusBadge } from "@/modules/client-forms/components/FormStatusBadge";
import { SendFormModal } from "@/modules/client-forms/components/SendFormModal";
import { Button } from "@/components/ui/button-shadcn";
import { AlertDialog } from "@/components/dialogs/Dialog";
import { useFeedback } from "@/contexts/feedback-context";
import { cn } from "@/lib/utils";
import { clientSetupService } from "@/modules/client-setup/service";
import { apiFetch } from "@/modules/auth/api/auth.api";
import { syncFormToBackendNow } from "@/modules/client-forms/sync-api";

interface FormEditorProps {
  formId: string;
  clientId: string;
  onClose: () => void;
  onSent?: () => void;
}

export function FormEditor({ formId, clientId, onClose, onSent }: FormEditorProps) {
  const { showSuccess, showInfo } = useFeedback();
  const [form, setForm] = useState<ClientForm | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const profile = clientSetupService.get(clientId);

  useEffect(() => {
    setForm(formsStore.getForm(formId));
  }, [formId]);

  const persist = useCallback((next: ClientForm) => {
    setForm(next);
    setDirty(true);
    formsStore.updateForm(next.id, {
      title: next.title,
      blocks: next.blocks,
      status: next.status,
    });
    setDirty(false);
  }, []);

  if (!form) {
    return (
      <div className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
        Formulário não encontrado.
      </div>
    );
  }

  const selected = form.blocks.find((b) => b.id === selectedId) ?? null;
  const formUrl = formsStore.getPublicFormUrl(form.slug);
  const alreadySent = form.status === "sent" || form.status === "answered";

  const addBlock = (type: FormBlockType) => {
    const block = createEmptyBlock(type);
    block.isNewField = false;
    persist({ ...form, blocks: [...form.blocks, block] });
    setSelectedId(block.id);
  };

  const updateBlock = (block: FormBlock) => {
    persist({
      ...form,
      blocks: form.blocks.map((b) => (b.id === block.id ? block : b)),
    });
  };

  const duplicateBlock = (id: string) => {
    const idx = form.blocks.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const copy = createEmptyBlock(form.blocks[idx].type);
    copy.label = form.blocks[idx].label;
    copy.content = form.blocks[idx].content;
    copy.isNewField = alreadySent;
    copy.options = form.blocks[idx].options.map((o) => ({
      ...o,
      id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    }));
    const blocks = [...form.blocks];
    blocks.splice(idx + 1, 0, copy);
    persist({ ...form, blocks });
    setSelectedId(copy.id);
  };

  const deleteBlock = (id: string) => {
    persist({ ...form, blocks: form.blocks.filter((b) => b.id !== id) });
    if (selectedId === id) setSelectedId(null);
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    const idx = form.blocks.findIndex((b) => b.id === id);
    const next = idx + dir;
    if (idx < 0 || next < 0 || next >= form.blocks.length) return;
    const blocks = [...form.blocks];
    const [item] = blocks.splice(idx, 1);
    blocks.splice(next, 0, item);
    persist({ ...form, blocks });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      persist(form);
      const current = formsStore.getForm(form.id);
      if (current && (current.status === "sent" || current.status === "answered")) {
        await syncFormToBackendNow(current);
      }
      showSuccess("Formulário salvo.");
    } catch (e) {
      showInfo(e instanceof Error ? e.message : "Falha ao salvar no servidor.");
    } finally {
      setSaving(false);
    }
  };

  const openSendModal = () => {
    if (form.blocks.length === 0) {
      showInfo("Adicione pelo menos um campo antes de enviar.");
      return;
    }
    setSendOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (form.blocks.length === 0) {
      showInfo("Adicione pelo menos um campo antes de atualizar.");
      return;
    }
    setUpdating(true);
    try {
      formsStore.updateForm(form.id, {
        title: form.title,
        blocks: form.blocks,
      });
      const updated = formsStore.markFormUpdated(form.id);
      if (!updated) {
        showInfo("Não foi possível atualizar o formulário.");
        return;
      }
      setForm(updated);
      await syncFormToBackendNow(updated);
      showSuccess("Formulário atualizado. O mesmo link do cliente já reflete as mudanças.");
      onSent?.();
    } catch (e) {
      showInfo(
        e instanceof Error
          ? e.message
          : "Falha ao publicar a atualização. Verifique se o backend está rodando."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSendConfirm = async (payload: {
    channel: "whatsapp" | "email";
    phone?: string;
    email?: string;
    subject?: string;
    message: string;
  }) => {
    const updated = formsStore.markFormSent(form.id);
    if (!updated) {
      showInfo("Não foi possível marcar o formulário como enviado.");
      return;
    }
    setForm(updated);

    try {
      await syncFormToBackendNow(updated);
    } catch (e) {
      showInfo(
        e instanceof Error
          ? e.message
          : "Falha ao publicar o formulário. Verifique se o backend está rodando."
      );
      return;
    }

    if (payload.channel === "whatsapp") {
      const digits = (payload.phone ?? "").replace(/\D/g, "");
      if (digits.length < 10) {
        showInfo("Informe um número de WhatsApp válido.");
        return;
      }
      const text = encodeURIComponent(payload.message);
      window.open(`https://wa.me/${digits}?text=${text}`, "_blank", "noopener,noreferrer");
      setSendOpen(false);
      showSuccess("WhatsApp aberto com a mensagem.");
      onSent?.();
      return;
    }

    const to = payload.email?.trim() ?? "";
    if (!to.includes("@")) {
      showInfo("Informe um e-mail válido.");
      return;
    }

    try {
      await apiFetch("/forms/send-invite", {
        method: "POST",
        body: JSON.stringify({
          to,
          subject: payload.subject || `Formulário — ${form.title}`,
          message: payload.message,
          formUrl,
        }),
      });
      setSendOpen(false);
      showSuccess("E-mail enviado ao cliente.");
      onSent?.();
    } catch (e) {
      showInfo(e instanceof Error ? e.message : "Falha ao enviar e-mail.");
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-surface overflow-hidden flex flex-col">
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              {alreadySent ? "Editar formulário" : "Editor"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {alreadySent
                ? "Altere campos e atualize o mesmo link enviado ao cliente."
                : "Monte o formulário com blocos. Nada vem preenchido."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_220px] h-[520px] min-h-0 shrink-0">
          <div className="h-full min-h-0 border-b lg:border-b-0 lg:border-r border-border-subtle p-3 overflow-hidden">
            <FormBlockPalette onAdd={addBlock} />
          </div>

          <div className="h-full min-h-0 flex flex-col border-b lg:border-b-0 lg:border-r border-border-subtle overflow-hidden">
            <div className="shrink-0 flex items-center gap-2 flex-wrap px-4 pt-4 pb-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  value={form.title}
                  onChange={(e) => persist({ ...form, title: e.target.value })}
                  className="bg-transparent text-sm font-medium text-foreground outline-none w-full min-w-0"
                  placeholder="Nome do formulário"
                />
              </div>
              <FormStatusBadge status={form.status} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-3 space-y-3">
              {form.blocks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border-subtle py-16 text-center">
                  <p className="text-sm text-muted-foreground">Formulário em branco</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Adicione componentes pela barra à esquerda.
                  </p>
                </div>
              ) : (
                form.blocks.map((block, idx) => (
                  <FormBlockItem
                    key={block.id}
                    block={block}
                    selected={selectedId === block.id}
                    onSelect={() => setSelectedId(block.id)}
                    onChange={updateBlock}
                    onDuplicate={() => duplicateBlock(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                    onMoveUp={() => moveBlock(block.id, -1)}
                    onMoveDown={() => moveBlock(block.id, 1)}
                    canMoveUp={idx > 0}
                    canMoveDown={idx < form.blocks.length - 1}
                  />
                ))
              )}
            </div>

            <div className="shrink-0 px-4 pb-4 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full h-9 text-xs border-border-subtle"
                onClick={() => addBlock("short_text")}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Adicionar campo
              </Button>
            </div>
          </div>

          <div className="h-full min-h-0 overflow-y-auto p-4">
            <p className="text-xs font-medium text-foreground mb-3">Configurações do campo</p>
            {!selected ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <Settings2 className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">Nenhum campo selecionado</p>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-[11px] text-muted-foreground">Tipo</span>
                  <p className="mt-1 text-xs text-foreground capitalize">
                    {selected.type.replace(/_/g, " ")}
                  </p>
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selected.required}
                    onChange={(e) =>
                      updateBlock({ ...selected, required: e.target.checked })
                    }
                    className="rounded border-border-subtle"
                  />
                  Obrigatório
                </label>
                {alreadySent ? (
                  <label className="flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-surface-inset/50 p-2.5">
                    <span className="flex items-center gap-2 text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={Boolean(selected.isNewField)}
                        onChange={(e) =>
                          updateBlock({ ...selected, isNewField: e.target.checked })
                        }
                        className="rounded border-border-subtle"
                      />
                      Campo novo
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-relaxed pl-5">
                      Se marcado, o cliente vê este campo destacado como novidade. Se não marcar,
                      aparece como se sempre tivesse existido.
                    </span>
                  </label>
                ) : null}
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Edite o texto do bloco no centro.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border-subtle bg-surface/80">
          <p className={cn("text-[11px] text-muted-foreground", dirty && "animate-pulse")}>
            {dirty ? "Salvando…" : "Salvo automaticamente"}
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleSave}
              disabled={saving}
            >
              Salvar formulário
            </Button>
            {alreadySent ? (
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-foreground text-accent-foreground"
                disabled={updating}
                onClick={() => setUpdateConfirmOpen(true)}
              >
                Atualizar formulário
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-foreground text-accent-foreground"
                onClick={openSendModal}
              >
                Enviar formulário
              </Button>
            )}
          </div>
        </div>
      </div>

      <SendFormModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        formUrl={formUrl}
        formTitle={form.title}
        defaultPhone={profile?.personal.telefone ?? ""}
        defaultEmail={
          profile?.service.emailRecuperacao || profile?.personal.email || ""
        }
        onConfirm={handleSendConfirm}
      />

      <AlertDialog
        open={updateConfirmOpen}
        onClose={() => setUpdateConfirmOpen(false)}
        title="Atualizar formulário?"
        message="As alterações serão publicadas no mesmo link já enviado ao cliente. Não será criado um formulário novo."
        confirmLabel={updating ? "Atualizando…" : "Confirmar atualização"}
        cancelLabel="Cancelar"
        onConfirm={() => {
          void handleUpdateConfirm();
        }}
      />
    </>
  );
}

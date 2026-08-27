"use client";

import { useEffect, useState } from "react";
import type { ClientForm, FormAnswerValue } from "@/modules/client-forms/types";
import { isAnswerBlock } from "@/modules/client-forms/types";
import * as formsStore from "@/modules/client-forms/store";
import {
  fetchPublicForm,
  submitPublicFormResponse,
} from "@/modules/client-forms/sync-api";
import { FormDeviceGate } from "@/modules/client-forms/components/FormDeviceGate";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

interface PublicFormViewProps {
  slug: string;
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      {children}
    </div>
  );
}

export function PublicFormView({ slug }: PublicFormViewProps) {
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<ClientForm | null>(null);
  const [answers, setAnswers] = useState<Record<string, FormAnswerValue>>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // 1) API (funciona em qualquer dispositivo)
      const remote = await fetchPublicForm(slug);
      if (cancelled) return;
      if (remote) {
        setForm(remote);
        setReady(true);
        return;
      }
      // 2) Fallback local (mesmo navegador do admin)
      setForm(formsStore.getFormBySlug(slug));
      setReady(true);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!ready) {
    return <div className="min-h-screen bg-[#0a0a0a]" aria-hidden />;
  }

  if (!form) {
    return (
      <Shell>
        <div className="text-center space-y-2">
          <h1 className="text-lg font-medium">Formulário indisponível</h1>
          <p className="text-sm text-white/50">Este link é inválido ou o formulário foi removido.</p>
        </div>
      </Shell>
    );
  }

  if (form.status === "draft" || form.status === "archived") {
    return (
      <Shell>
        <div className="text-center space-y-2">
          <h1 className="text-lg font-medium">Formulário indisponível</h1>
          <p className="text-sm text-white/50">
            Este formulário ainda não foi enviado ou foi arquivado.
          </p>
        </div>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <div className="text-center space-y-2 max-w-md">
          <h1 className="text-lg font-medium">Resposta enviada</h1>
          <p className="text-sm text-white/50">Obrigado. Suas respostas foram registradas.</p>
        </div>
      </Shell>
    );
  }

  const setAnswer = (blockId: string, value: FormAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [blockId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    for (const block of form.blocks) {
      if (!isAnswerBlock(block.type) || !block.required) continue;
      const v = answers[block.id];
      if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) {
        setError("Preencha todos os campos obrigatórios.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const ok = await submitPublicFormResponse(form.slug, answers);
      if (!ok) {
        // Fallback: mesmo navegador do admin
        const local = formsStore.submitResponse(form.id, answers);
        if (!local) {
          setError("Não foi possível enviar. Tente novamente.");
          return;
        }
      }
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormDeviceGate clientId={form.clientId}>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/40 mb-6">Norax</p>
          <h1 className="text-xl font-semibold tracking-tight">{form.title}</h1>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-6" autoComplete="off">
            {form.blocks.map((block) => {
              if (block.type === "title") {
                return (
                  <h2 key={block.id} className="text-base font-medium pt-2">
                    {block.label || "—"}
                  </h2>
                );
              }
              if (block.type === "text" || block.type === "info") {
                return (
                  <p key={block.id} className="text-sm text-white/55 leading-relaxed">
                    {block.content || "—"}
                  </p>
                );
              }
              if (block.type === "divider") {
                return <hr key={block.id} className="border-white/10" />;
              }
              if (block.type === "spacer") {
                return <div key={block.id} className="h-4" />;
              }

              return (
                <label key={block.id} className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm text-white/80">
                    <span>
                      {block.label || "Pergunta"}
                      {block.required ? <span className="text-red-400 ml-0.5">*</span> : null}
                    </span>
                    {block.isNewField ? (
                      <span className="text-[10px] uppercase tracking-wide rounded-full border border-sky-400/40 bg-sky-500/15 text-sky-300 px-2 py-0.5">
                        Campo novo
                      </span>
                    ) : null}
                  </span>

                  {block.type === "short_text" || block.type === "section" ? (
                    <Input
                      value={String(answers[block.id] ?? "")}
                      onChange={(e) => setAnswer(block.id, e.target.value)}
                      className="h-10 bg-[#111] border-white/10"
                    />
                  ) : null}
                  {block.type === "long_text" && (
                    <textarea
                      value={String(answers[block.id] ?? "")}
                      onChange={(e) => setAnswer(block.id, e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                    />
                  )}
                  {block.type === "date" && (
                    <Input
                      type="date"
                      value={String(answers[block.id] ?? "")}
                      onChange={(e) => setAnswer(block.id, e.target.value)}
                      className="h-10 bg-[#111] border-white/10 max-w-[200px]"
                    />
                  )}
                  {block.type === "number" && (
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={String(answers[block.id] ?? "")}
                      onChange={(e) => setAnswer(block.id, e.target.value)}
                      className="h-10 bg-[#111] border-white/10 max-w-[160px]"
                    />
                  )}
                  {block.type === "upload" && (
                    <Input
                      type="file"
                      onChange={(e) => {
                        const name = e.target.files?.[0]?.name ?? "";
                        setAnswer(block.id, name);
                      }}
                      className="h-10 bg-[#111] border-white/10 file:mr-3 file:text-xs"
                    />
                  )}
                  {block.type === "select" && (
                    <select
                      value={String(answers[block.id] ?? "")}
                      onChange={(e) => setAnswer(block.id, e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/10 bg-[#111] px-3 text-sm"
                    >
                      <option value="">Selecione…</option>
                      {block.options.map((o) => (
                        <option key={o.id} value={o.label}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {block.type === "multiple_choice" && (
                    <ul className="space-y-2">
                      {block.options.map((o) => (
                        <li key={o.id}>
                          <label className="flex items-center gap-2.5 text-sm text-white/80 cursor-pointer">
                            <input
                              type="radio"
                              name={block.id}
                              checked={answers[block.id] === o.label}
                              onChange={() => setAnswer(block.id, o.label)}
                              className="accent-white"
                            />
                            {o.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                  {block.type === "checkbox" && (
                    <ul className="space-y-2">
                      {block.options.map((o) => {
                        const current = Array.isArray(answers[block.id])
                          ? (answers[block.id] as string[])
                          : [];
                        const checked = current.includes(o.label);
                        return (
                          <li key={o.id}>
                            <label className="flex items-center gap-2.5 text-sm text-white/80 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const next = checked
                                    ? current.filter((x) => x !== o.label)
                                    : [...current, o.label];
                                  setAnswer(block.id, next);
                                }}
                                className="accent-white"
                              />
                              {o.label}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </label>
              );
            })}

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className={cn("w-full h-11 bg-white text-black hover:bg-white/90")}
            >
              {submitting ? "Enviando…" : "Enviar"}
            </Button>
          </form>
        </div>
      </div>
    </FormDeviceGate>
  );
}

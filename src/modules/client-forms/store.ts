import type { ClientForm, FormBlock, FormResponse, FormStatus } from "@/modules/client-forms/types";
import { createPublicSlug } from "@/modules/client-forms/block-factory";
import { syncFormInBackground } from "@/modules/client-forms/sync-api";

const FORMS_KEY = "norax.client-forms.v1";
const RESPONSES_KEY = "norax.client-form-responses.v1";

const forms = new Map<string, ClientForm>();
const responses = new Map<string, FormResponse>();
let hydrated = false;

function hydrate(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const rawForms = window.localStorage.getItem(FORMS_KEY);
    if (rawForms) {
      const list = JSON.parse(rawForms) as ClientForm[];
      if (Array.isArray(list)) {
        for (const f of list) forms.set(f.id, f);
      }
    }
    const rawResp = window.localStorage.getItem(RESPONSES_KEY);
    if (rawResp) {
      const list = JSON.parse(rawResp) as FormResponse[];
      if (Array.isArray(list)) {
        for (const r of list) responses.set(r.id, r);
      }
    }
  } catch {
    // ignore
  }
}

function persistForms(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FORMS_KEY, JSON.stringify([...forms.values()]));
  } catch {
    // ignore
  }
}

function persistResponses(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RESPONSES_KEY, JSON.stringify([...responses.values()]));
  } catch {
    // ignore
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

export function listFormsByClient(clientId: string): ClientForm[] {
  hydrate();
  return [...forms.values()]
    .filter((f) => f.clientId === clientId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getForm(id: string): ClientForm | null {
  hydrate();
  return forms.get(id) ?? null;
}

export function getFormBySlug(slug: string): ClientForm | null {
  hydrate();
  for (const f of forms.values()) {
    if (f.slug === slug) return f;
  }
  return null;
}

export function createForm(clientId: string, title = "Novo formulário"): ClientForm {
  hydrate();
  const form: ClientForm = {
    id: `form-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    clientId,
    title,
    status: "draft",
    slug: createPublicSlug(),
    blocks: [],
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    sentAt: null,
    meta: {},
  };
  forms.set(form.id, form);
  persistForms();
  // Sync só em save/send/update — sync a cada create/tecla satura a API (rate limit 100/15min)
  return form;
}

export function updateForm(
  id: string,
  patch: Partial<Pick<ClientForm, "title" | "blocks" | "status" | "sentAt" | "meta" | "version">>
): ClientForm | null {
  hydrate();
  const current = forms.get(id);
  if (!current) return null;
  const next: ClientForm = {
    ...current,
    ...patch,
    updatedAt: nowIso(),
  };
  forms.set(id, next);
  persistForms();
  return next;
}

export function setFormBlocks(id: string, blocks: FormBlock[]): ClientForm | null {
  return updateForm(id, { blocks });
}

export function markFormSent(id: string): ClientForm | null {
  const next = updateForm(id, { status: "sent", sentAt: nowIso() });
  if (next) syncFormInBackground(next);
  return next;
}

export function markFormUpdated(id: string): ClientForm | null {
  hydrate();
  const current = forms.get(id);
  if (!current) return null;
  const next = updateForm(id, {
    status: current.status === "draft" ? "sent" : current.status,
    version: current.version + 1,
    sentAt: current.sentAt ?? nowIso(),
  });
  if (next) syncFormInBackground(next);
  return next;
}

export function archiveForm(id: string): ClientForm | null {
  return updateForm(id, { status: "archived" });
}

export function deleteForm(id: string): boolean {
  hydrate();
  const ok = forms.delete(id);
  if (ok) {
    for (const [rid, r] of [...responses.entries()]) {
      if (r.formId === id) responses.delete(rid);
    }
    persistForms();
    persistResponses();
  }
  return ok;
}

export function deleteFormsByClientId(clientId: string): number {
  hydrate();
  let n = 0;
  for (const f of [...forms.values()]) {
    if (f.clientId !== clientId) continue;
    forms.delete(f.id);
    n += 1;
  }
  for (const [rid, r] of [...responses.entries()]) {
    if (r.clientId === clientId) responses.delete(rid);
  }
  persistForms();
  persistResponses();
  return n;
}

export function listResponsesByForm(formId: string): FormResponse[] {
  hydrate();
  return [...responses.values()]
    .filter((r) => r.formId === formId)
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export function listResponsesByClient(clientId: string): FormResponse[] {
  hydrate();
  return [...responses.values()]
    .filter((r) => r.clientId === clientId)
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export function countUnreviewedResponses(clientId: string): number {
  return listResponsesByClient(clientId).filter((r) => !r.reviewed).length;
}

export function submitResponse(
  formId: string,
  answers: FormResponse["answers"]
): FormResponse | null {
  hydrate();
  const form = forms.get(formId);
  if (!form) return null;
  if (form.status === "archived" || form.status === "draft") return null;

  const response: FormResponse = {
    id: `resp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    formId,
    clientId: form.clientId,
    answers,
    submittedAt: nowIso(),
    reviewed: false,
    meta: {},
  };
  responses.set(response.id, response);

  const nextStatus: FormStatus = "answered";
  forms.set(formId, {
    ...form,
    status: nextStatus,
    updatedAt: nowIso(),
  });
  persistForms();
  persistResponses();
  return response;
}

export function markResponseReviewed(responseId: string): FormResponse | null {
  hydrate();
  const current = responses.get(responseId);
  if (!current) return null;
  const next = { ...current, reviewed: true };
  responses.set(responseId, next);
  persistResponses();
  return next;
}

export function getPublicFormUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/forms/${slug}`;
  }
  return `/forms/${slug}`;
}

/** Reenvia formulários publicados ao banco (uma vez; sem flood). */
export function syncAllFormsInBackground(): void {
  hydrate();
  const started = performance.now();
  let n = 0;
  for (const form of forms.values()) {
    if (form.status === "draft" || form.status === "archived") continue;
    syncFormInBackground(form);
    n += 1;
  }
  console.info(
    `[perf] syncAllForms queued=${n} setup=${Math.round(performance.now() - started)}ms`
  );
}

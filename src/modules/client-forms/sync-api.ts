import { apiFetch, publicApiFetch } from "@/modules/auth/api/auth.api";
import type { ClientForm, FormAnswerValue } from "@/modules/client-forms/types";

const syncInFlight = new Map<string, Promise<void>>();
const lastSyncAt = new Map<string, number>();
const MIN_SYNC_GAP_MS = 2_000;

/** Empurra o formulário para o banco (necessário para o link funcionar no PC do cliente). */
export async function syncFormToBackend(form: ClientForm): Promise<void> {
  const existing = syncInFlight.get(form.id);
  if (existing) return existing;

  const last = lastSyncAt.get(form.id) ?? 0;
  const elapsed = Date.now() - last;
  if (elapsed < MIN_SYNC_GAP_MS && last > 0) {
    return;
  }

  const started = performance.now();
  const task = (async () => {
    try {
      await apiFetch("/forms/sync", {
        method: "PUT",
        body: JSON.stringify({
          id: form.id,
          clientId: form.clientId,
          title: form.title,
          status: form.status,
          slug: form.slug,
          blocks: form.blocks,
          version: form.version,
          sentAt: form.sentAt,
          meta: form.meta,
          createdAt: form.createdAt,
        }),
      });
      lastSyncAt.set(form.id, Date.now());
      const ms = Math.round(performance.now() - started);
      if (ms > 300) {
        console.info(`[perf] forms/sync ${form.id} ${ms}ms`);
      }
    } finally {
      syncInFlight.delete(form.id);
    }
  })();

  syncInFlight.set(form.id, task);
  return task;
}

/**
 * Sync em background com debounce por formulário.
 * NÃO chamar a cada keystroke — use só em save/send/update/sync-all.
 */
export function syncFormInBackground(form: ClientForm): void {
  void syncFormToBackend(form).catch((err) => {
    console.error("[norax] Falha ao sincronizar formulário:", err);
  });
}

/** Força sync imediato (ignora gap) — envio / atualização pública. */
export async function syncFormToBackendNow(form: ClientForm): Promise<void> {
  lastSyncAt.delete(form.id);
  syncInFlight.delete(form.id);
  const started = performance.now();
  await apiFetch("/forms/sync", {
    method: "PUT",
    body: JSON.stringify({
      id: form.id,
      clientId: form.clientId,
      title: form.title,
      status: form.status,
      slug: form.slug,
      blocks: form.blocks,
      version: form.version,
      sentAt: form.sentAt,
      meta: form.meta,
      createdAt: form.createdAt,
    }),
  });
  lastSyncAt.set(form.id, Date.now());
  console.info(`[perf] forms/sync(now) ${form.id} ${Math.round(performance.now() - started)}ms`);
}

/** Carrega formulário público pelo slug (qualquer dispositivo). */
export async function fetchPublicForm(slug: string): Promise<ClientForm | null> {
  const started = performance.now();
  try {
    const res = await publicApiFetch<ClientForm>(`/forms/public/${encodeURIComponent(slug)}`);
    console.info(`[perf] forms/public/${slug} ${Math.round(performance.now() - started)}ms`);
    return res.data;
  } catch {
    console.info(`[perf] forms/public/${slug} miss ${Math.round(performance.now() - started)}ms`);
    return null;
  }
}

export async function submitPublicFormResponse(
  slug: string,
  answers: Record<string, FormAnswerValue>
): Promise<boolean> {
  try {
    await publicApiFetch(`/forms/public/${encodeURIComponent(slug)}/responses`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
    return true;
  } catch {
    return false;
  }
}

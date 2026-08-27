import type {
  ClientPersonalData,
  ClientSetupProfile,
  PaymentConfig,
  ServiceInfo,
} from "@/modules/client-setup/types";
import { getNoraxCompanySnapshot } from "@/modules/client-setup/norax-company";
import { getSettings } from "@/mock/settings";

const STORAGE_KEY = "norax.client-setup.v1";
const profiles = new Map<string, ClientSetupProfile>();
let hydrated = false;

function normalizeService(raw: Partial<ServiceInfo> & { observacoes?: string }): ServiceInfo {
  const base = emptyService();
  const legacyEmail =
    typeof raw.observacoes === "string" && raw.observacoes.includes("@") ? raw.observacoes : "";
  return {
    ...base,
    ...raw,
    emailRecuperacao: raw.emailRecuperacao || legacyEmail || "",
  };
}

function hydrateProfiles(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const list = JSON.parse(raw) as ClientSetupProfile[];
    if (!Array.isArray(list)) return;
    for (const profile of list) {
      profiles.set(profile.clientId, {
        ...profile,
        service: normalizeService(profile.service ?? {}),
      });
    }
  } catch {
    // ignore
  }
}

function persistProfiles(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...profiles.values()]));
  } catch {
    // ignore
  }
}

function emptyPersonal(partial?: Partial<ClientPersonalData>): ClientPersonalData {
  return {
    nome: partial?.nome ?? "",
    empresa: partial?.empresa ?? "",
    documento: partial?.documento ?? "",
    email: partial?.email ?? "",
    telefone: partial?.telefone ?? "",
    endereco: partial?.endereco ?? "",
    cidade: partial?.cidade ?? "",
    estado: partial?.estado ?? "SP",
  };
}

function emptyService(): ServiceInfo {
  return {
    tipoServico: "Site Institucional",
    nomeProjeto: "",
    valorTotal: 0,
    dataInicio: new Date().toISOString().slice(0, 10),
    prazoPrevisto: "",
    responsavelInternoId: "",
    responsavelInternoNome: "",
    emailRecuperacao: "",
  };
}

function emptyPayment(): PaymentConfig {
  return {
    method: "pix_avista",
    installments: 1,
  };
}

export function getClientSetup(clientId: string): ClientSetupProfile | null {
  hydrateProfiles();
  return profiles.get(clientId) ?? null;
}

export function isClientSetupComplete(clientId: string): boolean {
  hydrateProfiles();
  return profiles.get(clientId)?.setupComplete === true;
}

export function ensureClientSetupDraft(
  clientId: string,
  seed?: Partial<ClientPersonalData>
): ClientSetupProfile {
  hydrateProfiles();
  const existing = profiles.get(clientId);
  if (existing) return existing;

  const draft: ClientSetupProfile = {
    clientId,
    setupComplete: false,
    setupCompletedAt: null,
    personal: emptyPersonal(seed),
    service: emptyService(),
    payment: emptyPayment(),
    norax: getNoraxCompanySnapshot(getSettings()),
    updatedAt: new Date().toISOString(),
  };
  profiles.set(clientId, draft);
  persistProfiles();
  return draft;
}

export function updateClientSetup(
  clientId: string,
  patch: Partial<
    Pick<ClientSetupProfile, "personal" | "service" | "payment" | "norax">
  >
): ClientSetupProfile {
  const current = ensureClientSetupDraft(clientId);
  const next: ClientSetupProfile = {
    ...current,
    personal: patch.personal ? { ...current.personal, ...patch.personal } : current.personal,
    service: patch.service ? { ...current.service, ...patch.service } : current.service,
    payment: patch.payment ? { ...current.payment, ...patch.payment } : current.payment,
    norax: patch.norax ? { ...current.norax, ...patch.norax } : current.norax,
    updatedAt: new Date().toISOString(),
  };
  profiles.set(clientId, next);
  persistProfiles();
  return next;
}

export function completeClientSetup(clientId: string): ClientSetupProfile {
  const current = ensureClientSetupDraft(clientId);
  // Refresh Norax snapshot from settings at finish
  const next: ClientSetupProfile = {
    ...current,
    norax: getNoraxCompanySnapshot(getSettings()),
    setupComplete: true,
    setupCompletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  profiles.set(clientId, next);
  persistProfiles();
  return next;
}

export function reopenClientSetup(clientId: string): ClientSetupProfile {
  const current = ensureClientSetupDraft(clientId);
  const next = { ...current, setupComplete: false, updatedAt: new Date().toISOString() };
  profiles.set(clientId, next);
  persistProfiles();
  return next;
}

export function deleteClientSetup(clientId: string): boolean {
  hydrateProfiles();
  const existed = profiles.delete(clientId);
  if (existed) persistProfiles();
  return existed;
}

export function formatPaymentLabel(payment: PaymentConfig): string {
  const labels: Record<string, string> = {
    pix_avista: "PIX à vista",
    pix_50_50: "PIX 50% / 50%",
    pix_personalizado: "PIX de %",
    cartao: "Cartão",
    cartao_parcelado: `Cartão ${payment.installments}x`,
    boleto: "Boleto",
    outro: "Outro",
  };
  return labels[payment.method] ?? payment.method;
}

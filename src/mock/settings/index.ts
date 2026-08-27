import { getSeedData } from "@/mock/seed";
import type { MockSettings } from "./types";

export * from "./types";
export { settings } from "./data";

const SETTINGS_STORAGE_KEY = "norax.settings.v1";

function hydrateSettings(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<MockSettings>;
    const current = getSeedData().settings;
    if (saved.empresa) current.empresa = { ...current.empresa, ...saved.empresa };
    if (saved.preferencias) {
      current.preferencias = { ...current.preferencias, ...saved.preferencias };
    }
  } catch {
    // ignore
  }
}

let hydrated = false;

export function getSettings(): MockSettings {
  if (!hydrated) {
    hydrated = true;
    hydrateSettings();
  }
  return getSeedData().settings;
}

export function updateSettings(patch: {
  empresa?: Partial<MockSettings["empresa"]>;
  preferencias?: Partial<MockSettings["preferencias"]>;
}): MockSettings {
  const current = getSettings();
  if (patch.empresa) {
    current.empresa = { ...current.empresa, ...patch.empresa };
  }
  if (patch.preferencias) {
    current.preferencias = { ...current.preferencias, ...patch.preferencias };
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          empresa: current.empresa,
          preferencias: current.preferencias,
        })
      );
    } catch {
      // ignore
    }
  }
  return current;
}

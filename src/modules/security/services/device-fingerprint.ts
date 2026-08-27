const FINGERPRINT_KEY = "norax-device-fp";
const MIN_FINGERPRINT_LENGTH = 16;

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const a = Math.abs(hash).toString(36).padStart(8, "0");
  const b = Math.abs(hash ^ 0x5f3759df)
    .toString(36)
    .padStart(8, "0");
  const c = input.length.toString(36).padStart(4, "0");
  return `nxr-${a}-${b}-${c}`;
}

export function getDeviceFingerprint(): string {
  if (typeof window === "undefined") return "server-fingerprint";

  const stored = localStorage.getItem(FINGERPRINT_KEY);
  if (stored && stored.length >= MIN_FINGERPRINT_LENGTH) return stored;

  // Entropia por perfil de navegador — sem isso, Chrome normal e anônimo
  // geravam o mesmo ID e herdavam acesso de outro contrato/sessão.
  const entropy =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? Array.from(crypto.getRandomValues(new Uint32Array(4)))
          .map((n) => n.toString(36))
          .join("-")
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    entropy,
  ].join("|");

  const fp = simpleHash(raw);
  localStorage.setItem(FINGERPRINT_KEY, fp);
  return fp;
}

const PORTAL_TOKEN_PREFIX = "norax-portal-token:";

export function getPortalToken(slug: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(`${PORTAL_TOKEN_PREFIX}${slug}`);
}

export function setPortalToken(slug: string, token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PORTAL_TOKEN_PREFIX}${slug}`, token);
}

export function clearPortalToken(slug: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(`${PORTAL_TOKEN_PREFIX}${slug}`);
}

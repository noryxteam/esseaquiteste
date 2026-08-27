function randomSlug(length = 11): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function generateUniqueSlug(existing: Set<string>): string {
  let slug: string;
  do {
    slug = randomSlug();
  } while (existing.has(slug));
  return slug;
}

export function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `NXR-${block()}-${block()}`;
}

export function generateDocumentHash(contractId: string, version: number): string {
  const base = `${contractId}-v${version}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(16, "0")}${randomSlug(8).toLowerCase()}`;
}

export function getShareLink(slug: string): string {
  return `https://contratos.norax.com/${slug}`;
}

export function nowBR(): { date: string; time: string } {
  const d = new Date();
  return {
    date: d.toLocaleDateString("pt-BR"),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export { getDeviceFingerprint } from "@/modules/security/services/device-fingerprint";

export function getDeviceLabel(): string {
  if (typeof navigator === "undefined") return "Dispositivo desconhecido";
  const ua = navigator.userAgent;
  if (/iPhone|iPad/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac/i.test(ua)) return "macOS";
  if (/Windows/i.test(ua)) return "Windows";
  return "Navegador web";
}

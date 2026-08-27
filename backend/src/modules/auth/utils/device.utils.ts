import type { DeviceType } from "@prisma/client";

const MOBILE_RE = /mobile|android|iphone|ipod/i;
const TABLET_RE = /ipad|tablet/i;
const NOTEBOOK_RE = /macintosh|windows|linux/i;

export function parseDeviceType(userAgent?: string): DeviceType {
  if (!userAgent) return "UNKNOWN";
  if (TABLET_RE.test(userAgent)) return "TABLET";
  if (MOBILE_RE.test(userAgent)) return "MOBILE";
  if (NOTEBOOK_RE.test(userAgent)) return "NOTEBOOK";
  return "DESKTOP";
}

export function parseDeviceName(userAgent?: string, override?: string): string {
  if (override) return override;
  if (!userAgent) return "Dispositivo desconhecido";
  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Macintosh/i.test(userAgent)) return "Mac";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Navegador web";
}

export function getRefreshExpiryDate(rememberMe: boolean): Date {
  const days = rememberMe ? 30 : 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

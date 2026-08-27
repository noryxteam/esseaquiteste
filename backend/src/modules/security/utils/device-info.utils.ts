import type { DeviceType } from "@prisma/client";
import { parseDeviceName, parseDeviceType } from "@/modules/auth/utils/device.utils";

export interface DeviceInfo {
  fingerprint: string;
  label: string;
  os: string;
  browser: string;
  deviceType: DeviceType;
  ip?: string;
  userAgent?: string;
}

export function parseBrowser(userAgent?: string): string {
  if (!userAgent) return "Desconhecido";
  if (/Edg\//i.test(userAgent)) return "Microsoft Edge";
  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) return "Google Chrome";
  if (/Firefox\//i.test(userAgent)) return "Mozilla Firefox";
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) return "Safari";
  return "Navegador";
}

export function parseOs(userAgent?: string): string {
  if (!userAgent) return "Desconhecido";
  if (/Windows NT 10\.0/i.test(userAgent)) {
    // UA geralmente não distingue 10/11; preferimos rótulo amigável.
    return "Windows 11";
  }
  if (/Windows NT 6\.3/i.test(userAgent)) return "Windows 8.1";
  if (/Windows NT 6\.1/i.test(userAgent)) return "Windows 7";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "macOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iOS/i.test(userAgent)) return "iOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Outro";
}

export function resolveDeviceInfo(
  fingerprint: string,
  userAgent?: string,
  ip?: string,
  labelOverride?: string
): DeviceInfo {
  return {
    fingerprint,
    label: labelOverride ?? parseDeviceName(userAgent),
    os: parseOs(userAgent),
    browser: parseBrowser(userAgent),
    deviceType: parseDeviceType(userAgent),
    ip,
    userAgent,
  };
}

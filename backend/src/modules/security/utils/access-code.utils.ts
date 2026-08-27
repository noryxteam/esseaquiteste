import { createHash, randomBytes } from "crypto";
import { env } from "@/config";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateAccessCode(): string {
  const block = () =>
    Array.from(randomBytes(4), (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
  return `NXR-${block()}-${block()}`;
}

export function hashAccessCode(code: string): string {
  const normalized = code.trim().toUpperCase();
  return createHash("sha256")
    .update(`${env.ACCESS_CODE_PEPPER}:${normalized}`)
    .digest("hex");
}

export function getCodeHint(code: string): string {
  const parts = code.toUpperCase().split("-");
  return parts[parts.length - 1] ?? "****";
}

export function normalizeAccessCode(input: string): string {
  const trimmed = input.trim().toUpperCase().replace(/\s/g, "");
  if (trimmed.startsWith("NXR-")) return trimmed;
  const digits = trimmed.replace(/[^A-Z0-9]/g, "");
  if (digits.length === 8) return `NXR-${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `NXR-${trimmed}`;
}

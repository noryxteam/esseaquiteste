import { createHash, randomBytes } from "crypto";
import { env } from "@/config";

export function generatePortalToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashPortalToken(token: string): string {
  return createHash("sha256")
    .update(`${env.PORTAL_TOKEN_SECRET}:${token}`)
    .digest("hex");
}

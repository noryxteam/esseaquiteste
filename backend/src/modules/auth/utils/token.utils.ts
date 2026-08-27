import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { env } from "@/config";
import type { AuthTokenPayload } from "@/modules/auth/types/auth.types";
import type { UserRole } from "@prisma/client";

export function generateAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function generateRefreshTokenValue(): string {
  return randomBytes(48).toString("hex");
}

export function generateResetTokenValue(): string {
  return randomBytes(32).toString("hex");
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}

export function mapUserTypeFromRole(role: UserRole) {
  if (role === "CLIENTE") return "CLIENT" as const;
  if (role === "ADMINISTRADOR") return "ADMINISTRATOR" as const;
  return "EMPLOYEE" as const;
}

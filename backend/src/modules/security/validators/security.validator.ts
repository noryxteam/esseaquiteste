import { z } from "zod";
import { DevicePermission } from "@prisma/client";

export const fingerprintHeaderSchema = z.object({
  fingerprint: z.string().min(16).max(128),
});

export const generateCodeSchema = z.object({
  validity: z.enum(["30m", "1h", "6h", "24h", "custom"]),
  customMinutes: z.number().int().min(5).max(10080).optional(),
});

export const renameDeviceSchema = z.object({
  label: z.string().min(1).max(80),
});

export const validateCodeSchema = z.object({
  code: z.string().min(4).max(20),
  fingerprint: z.string().min(16).max(128),
});

export const completeAccessSchema = z.object({
  codeId: z.string().min(1),
  fingerprint: z.string().min(16).max(128),
  trustDevice: z.boolean(),
});

export const portalSessionSchema = z.object({
  fingerprint: z.string().min(16).max(128),
  portalToken: z.string().min(1),
});

export const requestAccessSchema = z.object({
  fingerprint: z.string().min(16).max(128),
});

export const authorizeDevicePanelSchema = z.object({
  permission: z.nativeEnum(DevicePermission),
});

export const portalSignSchema = z.object({
  fingerprint: z.string().min(16).max(128),
  portalToken: z.string().min(1).optional(),
  nome: z.string().min(2).max(120),
  documento: z.string().min(5).max(40),
  data: z.string().optional(),
  hora: z.string().optional(),
  aceiteEletronico: z.literal(true),
});

export const registerTrustedDeviceSchema = z.object({
  fingerprint: z.string().min(16).max(128),
  label: z.string().min(1).max(80).optional(),
});

export const renameTrustedDeviceSchema = z.object({
  label: z.string().min(1).max(80),
});

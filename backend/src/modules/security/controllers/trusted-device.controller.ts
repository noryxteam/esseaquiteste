import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { trustedDeviceService } from "@/modules/security/services/trusted-device.service";
import {
  registerTrustedDeviceSchema,
  renameTrustedDeviceSchema,
} from "@/modules/security/validators/security.validator";
import { getRequestContext } from "@/modules/auth/middlewares/auth.middleware";
import { sendCreated, sendSuccess } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";

export const trustedDeviceController = {
  list: asyncHandler(async (req, res) => {
    if (!req.auth) throw new Error("Auth required");
    sendSuccess(res, await trustedDeviceService.list(req.auth.userId));
  }),

  register: asyncHandler(async (req, res) => {
    if (!req.auth) throw new Error("Auth required");
    const input = registerTrustedDeviceSchema.parse(req.body);
    sendCreated(
      res,
      await trustedDeviceService.register(
        req.auth.userId,
        input.fingerprint,
        input.label,
        getRequestContext(req)
      ),
      "Dispositivo confiável registrado."
    );
  }),

  rename: asyncHandler(async (req, res) => {
    if (!req.auth) throw new Error("Auth required");
    const { label } = renameTrustedDeviceSchema.parse(req.body);
    sendSuccess(
      res,
      await trustedDeviceService.rename(req.auth.userId, getParamId(req), label),
      "Dispositivo renomeado."
    );
  }),

  revoke: asyncHandler(async (req, res) => {
    if (!req.auth) throw new Error("Auth required");
    await trustedDeviceService.revoke(req.auth.userId, getParamId(req));
    sendSuccess(res, { success: true }, "Acesso do dispositivo removido.");
  }),

  remove: asyncHandler(async (req, res) => {
    if (!req.auth) throw new Error("Auth required");
    await trustedDeviceService.remove(req.auth.userId, getParamId(req));
    sendSuccess(res, { success: true }, "Dispositivo apagado.");
  }),

  restore: asyncHandler(async (req, res) => {
    if (!req.auth) throw new Error("Auth required");
    await trustedDeviceService.restore(req.auth.userId, getParamId(req));
    sendSuccess(res, { success: true }, "Acesso do dispositivo restaurado.");
  }),

  check: asyncHandler(async (req, res) => {
    if (!req.auth) throw new Error("Auth required");
    const fingerprint = String(req.query.fingerprint ?? req.headers["x-device-fingerprint"] ?? "");
    sendSuccess(res, await trustedDeviceService.check(req.auth.userId, fingerprint));
  }),
};

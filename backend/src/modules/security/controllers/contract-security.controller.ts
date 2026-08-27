import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { contractSecurityService } from "@/modules/security/services/contract-security.service";
import {
  generateCodeSchema,
  renameDeviceSchema,
} from "@/modules/security/validators/security.validator";
import { getRequestContext } from "@/modules/auth/middlewares/auth.middleware";
import { sendCreated, sendSuccess } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";

export const contractSecurityController = {
  overview: asyncHandler(async (req, res) =>
    sendSuccess(res, await contractSecurityService.getOverview(getParamId(req)))
  ),

  listDevices: asyncHandler(async (req, res) =>
    sendSuccess(res, await contractSecurityService.listDevices(getParamId(req)))
  ),

  deviceDetails: asyncHandler(async (req, res) =>
    sendSuccess(
      res,
      await contractSecurityService.getDeviceDetails(getParamId(req), getParamId(req, "deviceId"))
    )
  ),

  renameDevice: asyncHandler(async (req, res) => {
    const { label } = renameDeviceSchema.parse(req.body);
    sendSuccess(
      res,
      await contractSecurityService.renameDevice(
        getParamId(req),
        getParamId(req, "deviceId"),
        label,
        getRequestContext(req)
      ),
      "Dispositivo renomeado."
    );
  }),

  revokeDevice: asyncHandler(async (req, res) => {
    await contractSecurityService.revokeDevice(
      getParamId(req),
      getParamId(req, "deviceId"),
      getRequestContext(req)
    );
    sendSuccess(res, { success: true }, "Acesso revogado.");
  }),

  generateCode: asyncHandler(async (req, res) => {
    const input = generateCodeSchema.parse(req.body);
    sendCreated(
      res,
      await contractSecurityService.generateAccessCode(
        getParamId(req),
        input.validity,
        input.customMinutes,
        getRequestContext(req)
      ),
      "Código gerado."
    );
  }),

  listCodes: asyncHandler(async (req, res) =>
    sendSuccess(res, await contractSecurityService.listAccessCodes(getParamId(req)))
  ),

  listPendingRequests: asyncHandler(async (req, res) =>
    sendSuccess(res, await contractSecurityService.listPendingRequests(getParamId(req)))
  ),

  listAuthorizationHistory: asyncHandler(async (req, res) =>
    sendSuccess(res, await contractSecurityService.listAuthorizationHistory(getParamId(req)))
  ),

  cancelCode: asyncHandler(async (req, res) => {
    await contractSecurityService.cancelAccessCode(
      getParamId(req),
      getParamId(req, "codeId"),
      getRequestContext(req)
    );
    sendSuccess(res, { success: true }, "Código cancelado.");
  }),

  timeline: asyncHandler(async (req, res) =>
    sendSuccess(res, await contractSecurityService.getTimeline(getParamId(req)))
  ),
};

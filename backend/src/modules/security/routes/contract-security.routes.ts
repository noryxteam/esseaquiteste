import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contractSecurityController } from "@/modules/security/controllers/contract-security.controller";
import { requirePermission } from "@/modules/auth/middlewares/auth.middleware";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema, contractIdParamSchema } from "@/shared/validators/common.validator";
import { z } from "zod";

const deviceIdSchema = z.object({ deviceId: z.string().min(1) });
const codeIdSchema = z.object({ codeId: z.string().min(1) });

const securityLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Muitas tentativas.", error: "RATE_LIMIT" },
});

export const contractSecurityRoutes = Router({ mergeParams: true });

contractSecurityRoutes.use(securityLimiter);
contractSecurityRoutes.use(requirePermission("security:view"));

contractSecurityRoutes.get("/overview", contractSecurityController.overview);
contractSecurityRoutes.get("/devices", contractSecurityController.listDevices);
contractSecurityRoutes.get(
  "/devices/:deviceId",
  validateParams(deviceIdSchema),
  contractSecurityController.deviceDetails
);
contractSecurityRoutes.patch(
  "/devices/:deviceId",
  validateParams(deviceIdSchema),
  requirePermission("security:manage"),
  contractSecurityController.renameDevice
);
contractSecurityRoutes.post(
  "/devices/:deviceId/revoke",
  validateParams(deviceIdSchema),
  requirePermission("security:manage"),
  contractSecurityController.revokeDevice
);
contractSecurityRoutes.post(
  "/codes",
  requirePermission("security:manage"),
  contractSecurityController.generateCode
);
contractSecurityRoutes.get("/codes", contractSecurityController.listCodes);
contractSecurityRoutes.get("/pending-requests", contractSecurityController.listPendingRequests);
contractSecurityRoutes.get("/authorization-history", contractSecurityController.listAuthorizationHistory);
contractSecurityRoutes.post(
  "/codes/:codeId/cancel",
  validateParams(codeIdSchema),
  requirePermission("security:manage"),
  contractSecurityController.cancelCode
);
contractSecurityRoutes.get("/timeline", contractSecurityController.timeline);

export function mountContractSecurityRoutes(contractRouter: Router) {
  contractRouter.use(
    "/:id/security",
    validateParams(contractIdParamSchema),
    contractSecurityRoutes
  );
}

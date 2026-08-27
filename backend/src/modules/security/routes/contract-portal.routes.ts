import { Router } from "express";
import rateLimit from "express-rate-limit";
import { env } from "@/config";
import { contractPortalController } from "@/modules/security/controllers/contract-portal.controller";
import { optionalAuthMiddleware } from "@/modules/auth/middlewares/optional-auth.middleware";

const isDev = env.NODE_ENV === "development";

const portalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 500 : 60,
  message: { success: false, message: "Muitas tentativas.", error: "RATE_LIMIT" },
});

const validateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 200 : 20,
  message: { success: false, message: "Muitas tentativas de validação.", error: "RATE_LIMIT" },
});

export const contractPortalRoutes = Router();

contractPortalRoutes.use(optionalAuthMiddleware);
contractPortalRoutes.use(portalLimiter);

/** Clique Sim/Não no e-mail (antes de /:slug) */
contractPortalRoutes.get("/device-decision/:token", contractPortalController.deviceDecision);
contractPortalRoutes.get("/device-authorization/:token", contractPortalController.authorizationPanel);
contractPortalRoutes.post("/device-authorization/:token/authorize", contractPortalController.authorizeFromPanel);

contractPortalRoutes.get("/:slug", contractPortalController.resolve);
contractPortalRoutes.get("/:slug/document", contractPortalController.document);
contractPortalRoutes.get("/:slug/access-status", contractPortalController.accessStatus);
contractPortalRoutes.get("/:slug/access-request/:requestId", contractPortalController.accessRequestStatus);
contractPortalRoutes.post("/:slug/validate-code", validateLimiter, contractPortalController.validateCode);
contractPortalRoutes.post("/:slug/request-access", validateLimiter, contractPortalController.requestAccess);
contractPortalRoutes.post("/:slug/sign", validateLimiter, contractPortalController.sign);
contractPortalRoutes.post("/:slug/complete-access", contractPortalController.completeAccess);
contractPortalRoutes.post("/:slug/verify-session", contractPortalController.verifySession);
contractPortalRoutes.post("/:slug/client-devices", contractPortalController.clientDevices);
contractPortalRoutes.post("/:slug/request-device-code", contractPortalController.requestDeviceCode);

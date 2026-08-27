import { Router } from "express";
import { trustedDeviceController } from "@/modules/security/controllers/trusted-device.controller";
import { requirePermission } from "@/modules/auth/middlewares/auth.middleware";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const trustedDeviceRoutes = Router();

trustedDeviceRoutes.use(requirePermission("security:manage"));

trustedDeviceRoutes.get("/", trustedDeviceController.list);
trustedDeviceRoutes.get("/check", trustedDeviceController.check);
trustedDeviceRoutes.post("/", trustedDeviceController.register);
trustedDeviceRoutes.patch(
  "/:id",
  validateParams(idParamSchema),
  trustedDeviceController.rename
);
trustedDeviceRoutes.post(
  "/:id/revoke",
  validateParams(idParamSchema),
  trustedDeviceController.revoke
);
trustedDeviceRoutes.post(
  "/:id/restore",
  validateParams(idParamSchema),
  trustedDeviceController.restore
);
trustedDeviceRoutes.delete(
  "/:id",
  validateParams(idParamSchema),
  trustedDeviceController.remove
);

export const securityRoutes = Router();
securityRoutes.use("/trusted-devices", trustedDeviceRoutes);

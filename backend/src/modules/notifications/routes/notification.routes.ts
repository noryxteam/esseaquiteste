import { Router } from "express";
import { notificationController } from "@/modules/notifications/controllers/notification.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const notificationRoutes = Router();
notificationRoutes.get("/", notificationController.list);
notificationRoutes.get("/:id", validateParams(idParamSchema), notificationController.getById);
notificationRoutes.post("/", notificationController.create);
notificationRoutes.put("/:id", validateParams(idParamSchema), notificationController.update);
notificationRoutes.delete("/:id", validateParams(idParamSchema), notificationController.remove);

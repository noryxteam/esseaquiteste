import { Router } from "express";
import { fileController } from "@/modules/files/controllers/file.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const fileRoutes = Router();
fileRoutes.get("/", fileController.list);
fileRoutes.get("/:id", validateParams(idParamSchema), fileController.getById);
fileRoutes.post("/", fileController.create);
fileRoutes.put("/:id", validateParams(idParamSchema), fileController.update);
fileRoutes.delete("/:id", validateParams(idParamSchema), fileController.remove);

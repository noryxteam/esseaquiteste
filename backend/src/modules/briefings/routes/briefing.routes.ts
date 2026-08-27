import { Router } from "express";
import { briefingController } from "@/modules/briefings/controllers/briefing.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const briefingRoutes = Router();
briefingRoutes.get("/", briefingController.list);
briefingRoutes.get("/:id", validateParams(idParamSchema), briefingController.getById);
briefingRoutes.post("/", briefingController.create);
briefingRoutes.put("/:id", validateParams(idParamSchema), briefingController.update);
briefingRoutes.delete("/:id", validateParams(idParamSchema), briefingController.remove);

import { Router } from "express";
import { timelineController } from "@/modules/timeline/controllers/timeline.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const timelineRoutes = Router();
timelineRoutes.get("/", timelineController.list);
timelineRoutes.get("/:id", validateParams(idParamSchema), timelineController.getById);
timelineRoutes.post("/", timelineController.create);

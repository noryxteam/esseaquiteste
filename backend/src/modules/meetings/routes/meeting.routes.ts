import { Router } from "express";
import { meetingController } from "@/modules/meetings/controllers/meeting.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const meetingRoutes = Router();
meetingRoutes.get("/", meetingController.list);
meetingRoutes.get("/:id", validateParams(idParamSchema), meetingController.getById);
meetingRoutes.post("/", meetingController.create);
meetingRoutes.put("/:id", validateParams(idParamSchema), meetingController.update);
meetingRoutes.delete("/:id", validateParams(idParamSchema), meetingController.remove);

import { Router } from "express";
import { projectController } from "@/modules/projects/controllers/project.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

const projectRoutes = Router();
projectRoutes.get("/", projectController.list);
projectRoutes.get("/:id", validateParams(idParamSchema), projectController.getById);
projectRoutes.post("/", projectController.create);
projectRoutes.put("/:id", validateParams(idParamSchema), projectController.update);
projectRoutes.delete("/:id", validateParams(idParamSchema), projectController.remove);
export { projectRoutes };

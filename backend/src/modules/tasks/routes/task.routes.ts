import { Router } from "express";
import { taskController } from "@/modules/tasks/controllers/task.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const taskRoutes = Router();
taskRoutes.get("/", taskController.list);
taskRoutes.get("/:id", validateParams(idParamSchema), taskController.getById);
taskRoutes.post("/", taskController.create);
taskRoutes.put("/:id", validateParams(idParamSchema), taskController.update);
taskRoutes.delete("/:id", validateParams(idParamSchema), taskController.remove);

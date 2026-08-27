import { Router } from "express";
import { userController } from "@/modules/users/controllers/user.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const userRoutes = Router();
userRoutes.get("/", userController.list);
userRoutes.get("/:id", validateParams(idParamSchema), userController.getById);
userRoutes.post("/", userController.create);
userRoutes.put("/:id", validateParams(idParamSchema), userController.update);
userRoutes.delete("/:id", validateParams(idParamSchema), userController.remove);

import { Router } from "express";
import { financeController } from "@/modules/finance/controllers/finance.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const financeRoutes = Router();
financeRoutes.get("/", financeController.list);
financeRoutes.get("/:id", validateParams(idParamSchema), financeController.getById);
financeRoutes.post("/", financeController.create);
financeRoutes.put("/:id", validateParams(idParamSchema), financeController.update);
financeRoutes.delete("/:id", validateParams(idParamSchema), financeController.remove);

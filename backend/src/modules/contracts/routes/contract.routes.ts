import { Router } from "express";
import { contractController } from "@/modules/contracts/controllers/contract.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { contractIdParamSchema } from "@/shared/validators/common.validator";

export const contractRoutes = Router();
contractRoutes.get("/", contractController.list);
contractRoutes.put("/sync", contractController.sync);
contractRoutes.get("/:id", validateParams(contractIdParamSchema), contractController.getById);
contractRoutes.post("/", contractController.create);
contractRoutes.put("/:id", validateParams(contractIdParamSchema), contractController.update);
contractRoutes.delete("/:id", validateParams(contractIdParamSchema), contractController.remove);

import { Router } from "express";
import { clientController } from "@/modules/clients/controllers/client.controller";
import { clientSetupController } from "@/modules/clients/controllers/client-setup.controller";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

const clientRoutes = Router();

clientRoutes.get("/", clientController.list);
clientRoutes.get("/company-settings", clientSetupController.getCompanySettings);
clientRoutes.get("/contract-templates", clientSetupController.listTemplates);
clientRoutes.get("/:id/setup", validateParams(idParamSchema), clientSetupController.getSetup);
clientRoutes.post("/:id/setup/complete", validateParams(idParamSchema), clientSetupController.completeSetup);
clientRoutes.get("/:id", validateParams(idParamSchema), clientController.getById);
clientRoutes.post("/", clientController.create);
clientRoutes.put("/:id", validateParams(idParamSchema), clientController.update);
clientRoutes.delete("/:id", validateParams(idParamSchema), clientController.remove);

export { clientRoutes };
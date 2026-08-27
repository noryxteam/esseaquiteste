import { Router } from "express";
import { reportsController } from "@/modules/reports/controllers/reports.controller";

export const reportsRoutes = Router();
reportsRoutes.get("/dashboard", reportsController.dashboard);
reportsRoutes.get("/monthly", reportsController.monthly);

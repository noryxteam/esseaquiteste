import { Router } from "express";
import { searchController } from "@/modules/search/controllers/search.controller";

export const searchRoutes = Router();
searchRoutes.get("/", searchController.global);

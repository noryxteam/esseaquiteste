import type { Request, Response } from "express";
import { reportsService } from "@/modules/reports/services/reports.service";
import { sendSuccess } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";

export const reportsController = {
  dashboard: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await reportsService.getDashboard());
  }),
  monthly: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await reportsService.getMonthlyReports());
  }),
};

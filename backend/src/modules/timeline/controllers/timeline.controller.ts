import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { timelineModuleService } from "@/modules/timeline/services/timeline.service";
import { createTimelineSchema } from "@/modules/timeline/validators/timeline.validator";
import { sendCreated, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const timelineController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await timelineModuleService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await timelineModuleService.getById(getParamId(req)));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await timelineModuleService.create(createTimelineSchema.parse(req.body)), "Evento criado.");
  }),
};

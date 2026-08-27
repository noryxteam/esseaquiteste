import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { briefingService } from "@/modules/briefings/services/briefing.service";
import { createBriefingSchema, updateBriefingSchema } from "@/modules/briefings/validators/briefing.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const briefingController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await briefingService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await briefingService.getById(getParamId(req)));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await briefingService.create(createBriefingSchema.parse(req.body), getRequestContext(req)), "Briefing criado.");
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await briefingService.update(getParamId(req), updateBriefingSchema.parse(req.body), getRequestContext(req)), "Briefing atualizado.");
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await briefingService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

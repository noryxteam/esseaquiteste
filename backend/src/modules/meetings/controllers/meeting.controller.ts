import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { meetingService } from "@/modules/meetings/services/meeting.service";
import { createMeetingSchema, updateMeetingSchema } from "@/modules/meetings/validators/meeting.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const meetingController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await meetingService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await meetingService.getById(getParamId(req)));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await meetingService.create(createMeetingSchema.parse(req.body), getRequestContext(req)), "Reunião criada.");
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await meetingService.update(getParamId(req), updateMeetingSchema.parse(req.body), getRequestContext(req)), "Reunião atualizada.");
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await meetingService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

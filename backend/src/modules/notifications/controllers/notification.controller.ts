import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { notificationService } from "@/modules/notifications/services/notification.service";
import { createNotificationSchema, updateNotificationSchema } from "@/modules/notifications/validators/notification.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await notificationService.getById(getParamId(req)))),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await notificationService.create(createNotificationSchema.parse(req.body), getRequestContext(req)), "Notificação criada.");
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await notificationService.update(getParamId(req), updateNotificationSchema.parse(req.body), getRequestContext(req)), "Notificação atualizada.");
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { fileService } from "@/modules/files/services/file.service";
import { createFileSchema, updateFileSchema } from "@/modules/files/validators/file.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const fileController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await fileService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await fileService.getById(getParamId(req)))),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await fileService.create(createFileSchema.parse(req.body), getRequestContext(req)), "Arquivo registrado.");
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await fileService.update(getParamId(req), updateFileSchema.parse(req.body), getRequestContext(req)), "Arquivo atualizado.");
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await fileService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

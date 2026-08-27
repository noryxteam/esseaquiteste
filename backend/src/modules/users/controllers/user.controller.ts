import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { userService } from "@/modules/users/services/user.service";
import { createUserSchema, updateUserSchema } from "@/modules/users/validators/user.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await userService.getById(getParamId(req)))),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await userService.create(createUserSchema.parse(req.body), getRequestContext(req)), "Usuário criado.");
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await userService.update(getParamId(req), updateUserSchema.parse(req.body), getRequestContext(req)), "Usuário atualizado.");
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await userService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

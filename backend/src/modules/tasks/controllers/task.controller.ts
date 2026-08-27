import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { taskService } from "@/modules/tasks/services/task.service";
import { createTaskSchema, updateTaskSchema } from "@/modules/tasks/validators/task.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const taskController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await taskService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await taskService.getById(getParamId(req)))),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await taskService.create(createTaskSchema.parse(req.body), getRequestContext(req)), "Tarefa criada.");
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await taskService.update(getParamId(req), updateTaskSchema.parse(req.body), getRequestContext(req)), "Tarefa atualizada.");
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await taskService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

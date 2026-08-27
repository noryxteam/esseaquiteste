import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { financeService } from "@/modules/finance/services/finance.service";
import { createFinanceSchema, updateFinanceSchema } from "@/modules/finance/validators/finance.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const financeController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await financeService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req: Request, res: Response) => sendSuccess(res, await financeService.getById(getParamId(req)))),
  create: asyncHandler(async (req: Request, res: Response) => {
    sendCreated(res, await financeService.create(createFinanceSchema.parse(req.body), getRequestContext(req)), "Movimentação criada.");
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await financeService.update(getParamId(req), updateFinanceSchema.parse(req.body), getRequestContext(req)), "Movimentação atualizada.");
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await financeService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

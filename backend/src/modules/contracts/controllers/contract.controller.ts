import type { Request, Response } from "express";
import { getParamId } from "@/shared/utils/request";
import { contractService } from "@/modules/contracts/services/contract.service";
import {
  createContractSchema,
  syncContractSchema,
  updateContractSchema,
} from "@/modules/contracts/validators/contract.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { asyncHandler } from "@/shared/utils/async-handler";

export const contractController = {
  list: asyncHandler(async (req, res) => {
    const result = await contractService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  }),
  getById: asyncHandler(async (req, res) => sendSuccess(res, await contractService.getById(getParamId(req)))),
  create: asyncHandler(async (req, res) => {
    const input = createContractSchema.parse(req.body);
    sendCreated(res, await contractService.create(input, getRequestContext(req)), "Contrato criado.");
  }),
  sync: asyncHandler(async (req, res) => {
    const input = syncContractSchema.parse(req.body);
    sendSuccess(
      res,
      await contractService.syncFromPanel(input, getRequestContext(req)),
      "Contrato sincronizado."
    );
  }),
  update: asyncHandler(async (req, res) => {
    const input = updateContractSchema.parse(req.body);
    sendSuccess(res, await contractService.update(getParamId(req), input, getRequestContext(req)), "Contrato atualizado.");
  }),
  remove: asyncHandler(async (req, res) => {
    await contractService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  }),
};

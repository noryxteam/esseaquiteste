import type { Request, Response } from "express";
import { clientService } from "@/modules/clients/services/client.service";
import { createClientSchema, updateClientSchema } from "@/modules/clients/validators/client.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { getParamId } from "@/shared/utils/request";
import { asyncHandler } from "@/shared/utils/async-handler";

export class ClientController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await clientService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const client = await clientService.getById(getParamId(req));
    sendSuccess(res, client);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const input = createClientSchema.parse(req.body);
    const client = await clientService.create(input, getRequestContext(req));
    sendCreated(res, client, "Cliente criado com sucesso.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const input = updateClientSchema.parse(req.body);
    const client = await clientService.update(getParamId(req), input, getRequestContext(req));
    sendSuccess(res, client, "Cliente atualizado com sucesso.");
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await clientService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  });
}

export const clientController = new ClientController();

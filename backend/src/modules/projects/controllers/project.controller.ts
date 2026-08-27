import type { Request, Response } from "express";
import { projectService } from "@/modules/projects/services/project.service";
import { createProjectSchema, updateProjectSchema } from "@/modules/projects/validators/project.validator";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendNoContent, sendPaginated, sendSuccess } from "@/shared/utils/api-response";
import { parsePaginationParams } from "@/shared/utils/pagination";
import { getParamId } from "@/shared/utils/request";
import { asyncHandler } from "@/shared/utils/async-handler";

export class ProjectController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await projectService.list(parsePaginationParams(req));
    sendPaginated(res, result.data, result.pagination);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await projectService.getById(getParamId(req)));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const input = createProjectSchema.parse(req.body);
    sendCreated(res, await projectService.create(input, getRequestContext(req)), "Projeto criado com sucesso.");
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const input = updateProjectSchema.parse(req.body);
    sendSuccess(res, await projectService.update(getParamId(req), input, getRequestContext(req)), "Projeto atualizado.");
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await projectService.remove(getParamId(req), getRequestContext(req));
    sendNoContent(res);
  });
}

export const projectController = new ProjectController();

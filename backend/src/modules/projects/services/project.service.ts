import { NotFoundError } from "@/shared/types/errors";
import { projectRepository } from "@/modules/projects/repositories/project.repository";
import type { CreateProjectInput, UpdateProjectInput } from "@/modules/projects/validators/project.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class ProjectService {
  async list(params: PaginationParams) {
    const { data, total } = await projectRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw new NotFoundError("Projeto não encontrado.", "PROJECT_NOT_FOUND");
    return project;
  }

  async create(input: CreateProjectInput, ctx: RequestContext) {
    const project = await projectRepository.create(input);
    await auditService.logCreate("Project", project.id, ctx);
    await emitDomainEvent({
      type: DomainEventType.PROJECT_CREATED,
      payload: {
        projectId: project.id,
        clienteId: project.clienteId,
        nome: project.nome,
        responsavelId: project.responsavelId,
      },
      context: ctx,
    });
    return project;
  }

  async update(id: string, input: UpdateProjectInput, ctx: RequestContext) {
    const previous = await this.getById(id);
    const project = await projectRepository.update(id, input);
    await auditService.logUpdate("Project", id, ctx, { changes: input });
    if (input.status && input.status !== previous.status) {
      await auditService.logStatusChange("Project", id, ctx, previous.status, input.status);
      if (input.status === "CONCLUIDO") {
        await emitDomainEvent({
          type: DomainEventType.PROJECT_COMPLETED,
          payload: { projectId: id, clienteId: project.clienteId, nome: project.nome },
          context: ctx,
        });
      }
    }
    await emitDomainEvent({
      type: DomainEventType.PROJECT_UPDATED,
      payload: {
        projectId: id,
        clienteId: project.clienteId,
        nome: project.nome,
        status: project.status,
      },
      context: ctx,
    });
    return project;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await projectRepository.softDelete(id);
    await auditService.logDelete("Project", id, ctx);
  }
}

export const projectService = new ProjectService();

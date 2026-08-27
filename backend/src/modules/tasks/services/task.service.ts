import { NotFoundError } from "@/shared/types/errors";
import { taskRepository } from "@/modules/tasks/repositories/task.repository";
import type { CreateTaskInput, UpdateTaskInput } from "@/modules/tasks/validators/task.validator";
import type { PaginationParams, RequestContext } from "@/shared/types/api";
import { auditService } from "@/shared/services/audit.service";
import { emitDomainEvent } from "@/shared/events/emit";
import { DomainEventType } from "@/shared/events/types";
import { buildPaginationMeta } from "@/shared/utils/pagination";

export class TaskService {
  async list(params: PaginationParams) {
    const { data, total } = await taskRepository.findMany(params);
    return { data, pagination: buildPaginationMeta(total, params.page, params.limit) };
  }

  async getById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new NotFoundError("Tarefa não encontrada.", "TASK_NOT_FOUND");
    return task;
  }

  async create(input: CreateTaskInput, ctx: RequestContext) {
    const task = await taskRepository.create(input);
    await auditService.logCreate("Task", task.id, ctx);
    await emitDomainEvent({
      type: DomainEventType.TASK_CREATED,
      payload: {
        taskId: task.id,
        clienteId: task.clienteId,
        projetoId: task.projetoId,
        titulo: task.titulo,
      },
      context: ctx,
    });
    return task;
  }

  async update(id: string, input: UpdateTaskInput, ctx: RequestContext) {
    const previous = await this.getById(id);
    const data = { ...input };
    if (input.status === "CONCLUIDA" && !input.concluidoEm) {
      data.concluidoEm = new Date();
    }
    const task = await taskRepository.update(id, data);
    await auditService.logUpdate("Task", id, ctx, { changes: input });
    if (input.status === "CONCLUIDA" && previous.status !== "CONCLUIDA") {
      await emitDomainEvent({
        type: DomainEventType.TASK_COMPLETED,
        payload: {
          taskId: task.id,
          clienteId: task.clienteId,
          projetoId: task.projetoId,
          titulo: task.titulo,
        },
        context: ctx,
      });
    }
    return task;
  }

  async remove(id: string, ctx: RequestContext) {
    await this.getById(id);
    await taskRepository.softDelete(id);
    await auditService.logDelete("Task", id, ctx);
  }
}

export const taskService = new TaskService();

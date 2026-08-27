import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateTaskInput, UpdateTaskInput } from "@/modules/tasks/validators/task.validator";

const SORT_FIELDS = ["createdAt", "prazo", "status", "prioridade", "titulo"];
const SEARCH_FIELDS = ["titulo", "descricao"];
const include = {
  cliente: { select: { id: true, empresa: true } },
  projeto: { select: { id: true, nome: true } },
  responsavel: { select: { id: true, nome: true, email: true } },
};

export class TaskRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.task.findMany({ ...args, include }),
      (args) => prisma.task.count(args),
      where, params, SORT_FIELDS, "prazo"
    );
  }

  async findById(id: string) {
    return prisma.task.findFirst({ where: { id, ...softDeleteWhere() }, include });
  }

  async create(data: CreateTaskInput) {
    return prisma.task.create({ data, include });
  }

  async update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    return prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const taskRepository = new TaskRepository();

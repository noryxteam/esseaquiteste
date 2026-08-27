import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import {
  buildSearchOr,
  mergeWhere,
  paginatedQuery,
  softDeleteWhere,
} from "@/shared/repositories/base.repository";
import type { CreateProjectInput, UpdateProjectInput } from "@/modules/projects/validators/project.validator";

const SORT_FIELDS = ["createdAt", "nome", "status", "prazo", "dataInicio", "valor"];
const SEARCH_FIELDS = ["nome", "descricao"];
const include = {
  cliente: { select: { id: true, empresa: true, nome: true } },
  responsavel: { select: { id: true, nome: true, email: true } },
};

export class ProjectRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.project.findMany({ ...args, include }),
      (args) => prisma.project.count(args),
      where,
      params,
      SORT_FIELDS
    );
  }

  async findById(id: string) {
    return prisma.project.findFirst({
      where: { id, ...softDeleteWhere() },
      include: {
        ...include,
        contracts: { where: softDeleteWhere() },
        briefings: { where: softDeleteWhere() },
        tasks: { where: softDeleteWhere(), take: 20 },
      },
    });
  }

  async create(data: CreateProjectInput) {
    return prisma.project.create({ data, include });
  }

  async update(id: string, data: UpdateProjectInput) {
    return prisma.project.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    return prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const projectRepository = new ProjectRepository();

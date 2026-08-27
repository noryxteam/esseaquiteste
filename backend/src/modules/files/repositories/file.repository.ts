import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateFileInput, UpdateFileInput } from "@/modules/files/validators/file.validator";

const SORT_FIELDS = ["createdAt", "nome", "categoria", "tamanho"];
const SEARCH_FIELDS = ["nome", "tipo"];
const include = {
  cliente: { select: { id: true, empresa: true } },
  projeto: { select: { id: true, nome: true } },
};

export class FileRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.file.findMany({ ...args, include }),
      (args) => prisma.file.count(args),
      where, params, SORT_FIELDS
    );
  }

  async findById(id: string) {
    return prisma.file.findFirst({ where: { id, ...softDeleteWhere() }, include });
  }

  async create(data: CreateFileInput) {
    return prisma.file.create({ data, include });
  }

  async update(id: string, data: UpdateFileInput) {
    return prisma.file.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    return prisma.file.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const fileRepository = new FileRepository();

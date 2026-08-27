import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateBriefingInput, UpdateBriefingInput } from "@/modules/briefings/validators/briefing.validator";

const SORT_FIELDS = ["createdAt"];
const SEARCH_FIELDS = ["resumo"];
const include = {
  cliente: { select: { id: true, empresa: true } },
  projeto: { select: { id: true, nome: true } },
};

export class BriefingRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.briefing.findMany({ ...args, include }),
      (args) => prisma.briefing.count(args),
      where, params, SORT_FIELDS
    );
  }

  async findById(id: string) {
    return prisma.briefing.findFirst({ where: { id, ...softDeleteWhere() }, include });
  }

  async create(data: CreateBriefingInput) {
    return prisma.briefing.create({ data, include });
  }

  async update(id: string, data: UpdateBriefingInput) {
    return prisma.briefing.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    return prisma.briefing.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export const briefingRepository = new BriefingRepository();

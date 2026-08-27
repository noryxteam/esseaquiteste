import { prisma } from "@/database";
import type { PaginationParams } from "@/shared/types/api";
import { buildSearchOr, mergeWhere, paginatedQuery, softDeleteWhere } from "@/shared/repositories/base.repository";
import type { CreateTimelineInput } from "@/modules/timeline/validators/timeline.validator";

const SORT_FIELDS = ["createdAt", "data", "tipo"];
const SEARCH_FIELDS = ["titulo", "descricao"];

export class TimelineRepository {
  async findMany(params: PaginationParams) {
    const where = mergeWhere(softDeleteWhere(), buildSearchOr(params.search, SEARCH_FIELDS), params.filters);
    return paginatedQuery(
      (args) => prisma.timelineEvent.findMany({ ...args }),
      (args) => prisma.timelineEvent.count(args),
      where, params, SORT_FIELDS, "data"
    );
  }

  async findById(id: string) {
    return prisma.timelineEvent.findFirst({ where: { id, ...softDeleteWhere() } });
  }

  async create(data: CreateTimelineInput) {
    const now = new Date();
    return prisma.timelineEvent.create({
      data: {
        ...data,
        data: data.data ?? now,
        hora: data.hora ?? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      },
    });
  }
}

export const timelineRepository = new TimelineRepository();

import type { Prisma } from "@prisma/client";
import type { PaginationParams } from "@/shared/types/api";
import { getSkip } from "@/shared/utils/pagination";

export interface ListResult<T> {
  data: T[];
  total: number;
}

export function softDeleteWhere(): { deletedAt: null } {
  return { deletedAt: null };
}

export function buildOrderBy(
  sortBy: string | undefined,
  sortOrder: "asc" | "desc",
  allowedFields: string[],
  defaultField = "createdAt"
): Record<string, "asc" | "desc"> {
  const field = sortBy && allowedFields.includes(sortBy) ? sortBy : defaultField;
  return { [field]: sortOrder };
}

export async function paginatedQuery<T>(
  findMany: (args: { where: object; skip: number; take: number; orderBy: object }) => Promise<T[]>,
  count: (args: { where: object }) => Promise<number>,
  where: object,
  params: PaginationParams,
  allowedSortFields: string[],
  defaultSortField = "createdAt"
): Promise<ListResult<T>> {
  const orderBy = buildOrderBy(params.sortBy, params.sortOrder, allowedSortFields, defaultSortField);
  const skip = getSkip(params.page, params.limit);

  const [data, total] = await Promise.all([
    findMany({ where, skip, take: params.limit, orderBy }),
    count({ where }),
  ]);

  return { data, total };
}

export function buildSearchOr(
  search: string | undefined,
  fields: string[]
): Prisma.Enumerable<Record<string, unknown>> | undefined {
  if (!search) return undefined;
  return fields.map((field) => ({
    [field]: { contains: search, mode: "insensitive" as const },
  }));
}

export function mergeWhere(
  base: Record<string, unknown>,
  searchOr?: Prisma.Enumerable<Record<string, unknown>>,
  filters?: Record<string, string>
): Record<string, unknown> {
  const where: Record<string, unknown> = { ...base };

  if (searchOr) {
    where.OR = searchOr;
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      where[key] = value;
    }
  }

  return where;
}

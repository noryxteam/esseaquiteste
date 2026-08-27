import type { Request } from "express";
import type { PaginationMeta, PaginationParams } from "@/shared/types/api";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePaginationParams(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(String(req.query.page ?? DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const rawLimit = parseInt(String(req.query.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
  const search = req.query.search ? String(req.query.search).trim() : undefined;
  const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
  const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

  const reserved = new Set(["page", "limit", "search", "sortBy", "sortOrder"]);
  const filters: Record<string, string> = {};

  for (const [key, value] of Object.entries(req.query)) {
    if (!reserved.has(key) && value !== undefined && value !== "") {
      filters[key] = String(value);
    }
  }

  return { page, limit, search, sortBy, sortOrder, filters };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

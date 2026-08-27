import type { Response } from "express";
import type { ApiErrorResponse, ApiPaginatedResponse, ApiSuccessResponse, PaginationMeta } from "@/shared/types/api";

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  const body: ApiSuccessResponse<T> = { success: true, data, ...(message ? { message } : {}) };
  res.status(statusCode).json(body);
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta
): void {
  const body: ApiPaginatedResponse<T> = { success: true, data, pagination };
  res.status(200).json(body);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}

export function sendError(
  res: Response,
  message: string,
  error: string,
  statusCode = 500,
  details?: unknown
): void {
  const body: ApiErrorResponse = { success: false, message, error, ...(details ? { details } : {}) };
  res.status(statusCode).json(body);
}

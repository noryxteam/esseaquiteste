import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/shared/utils/app-error";
import { sendError } from "@/shared/utils/api-response";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { logger } from "@/shared/services/logger.service";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.error, err.statusCode, err.details);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, "Dados inválidos.", "VALIDATION_ERROR", 400, err.flatten());
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      sendError(res, "Registro duplicado.", "DUPLICATE_ENTRY", 409);
      return;
    }
    if (err.code === "P2025") {
      sendError(res, "Recurso não encontrado.", "NOT_FOUND", 404);
      return;
    }
  }

  logger.error("Erro não tratado", { error: err });
  sendError(res, "Erro interno do servidor.", "INTERNAL_ERROR", 500);
}

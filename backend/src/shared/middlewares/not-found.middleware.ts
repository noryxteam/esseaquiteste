import type { Request, Response } from "express";
import { sendError } from "@/shared/utils/api-response";

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Rota não encontrada: ${req.method} ${req.path}`, "ROUTE_NOT_FOUND", 404);
}

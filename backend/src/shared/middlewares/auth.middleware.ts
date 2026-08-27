export {
  authMiddleware,
  requireRoles,
  requirePermission,
  requireAnyPermission,
  getRequestContext,
} from "@/modules/auth/middlewares/auth.middleware";

import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "@/modules/auth/utils/token.utils";

/** Middleware opcional — não bloqueia se não houver token válido. */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }
  try {
    req.auth = verifyAccessToken(header.slice(7));
  } catch {
    // ignora token inválido
  }
  next();
}

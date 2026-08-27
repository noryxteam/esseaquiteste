import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/database";
import { verifyAccessToken } from "@/modules/auth/utils/token.utils";

export async function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      next();
      return;
    }
    const payload = verifyAccessToken(header.slice(7));
    const user = await prisma.user.findFirst({
      where: { id: payload.userId, deletedAt: null, ativo: true },
    });
    if (user && user.status !== "BLOCKED" && user.status !== "INACTIVE") {
      req.auth = payload;
    }
  } catch {
    // Ignora token inválido em rotas públicas
  }
  next();
}

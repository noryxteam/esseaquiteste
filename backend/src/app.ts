import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "@/config";
import { apiRoutes } from "@/shared/routes";
import { errorHandler } from "@/shared/middlewares/error.middleware";
import { notFoundHandler } from "@/shared/middlewares/not-found.middleware";
import { requestLogger } from "@/shared/middlewares/request-logger.middleware";
import { rateLimiter } from "@/shared/middlewares/rate-limit.middleware";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(rateLimiter);

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok", service: "norax-api" } });
  });

  // Documentação OpenAPI — preparada para Swagger UI
  app.get("/api-docs", (_req, res) => {
    res.json({
      success: true,
      data: {
        message: "Documentação OpenAPI disponível em /api-docs/openapi.json",
        openapi: `${env.API_PREFIX}/docs/openapi.json`,
      },
    });
  });

  app.get(`${env.API_PREFIX}/docs/openapi.json`, (_req, res) => {
    res.sendFile(path.join(process.cwd(), "docs", "openapi.json"));
  });

  app.use(env.API_PREFIX, apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

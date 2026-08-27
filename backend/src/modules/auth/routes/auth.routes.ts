import { Router } from "express";
import { authController } from "@/modules/auth/controllers/auth.controller";
import { authMiddleware } from "@/modules/auth/middlewares/auth.middleware";
import { authRateLimiter, loginRateLimiter } from "@/modules/auth/middlewares/rate-limit.middleware";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";

export const authRoutes = Router();

authRoutes.use(authRateLimiter);

authRoutes.post("/login", loginRateLimiter, authController.login);
authRoutes.post("/refresh", authController.refresh);
authRoutes.post("/forgot-password", authController.forgotPassword);
authRoutes.post("/reset-password", authController.resetPassword);

authRoutes.use(authMiddleware);

authRoutes.get("/me", authController.me);
authRoutes.post("/logout", authController.logout);
authRoutes.post("/change-password", authController.changePassword);
authRoutes.get("/sessions", authController.sessions);
authRoutes.delete("/sessions/:id", validateParams(idParamSchema), authController.revokeSession);

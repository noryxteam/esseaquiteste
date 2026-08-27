import type { Request, Response } from "express";
import { authService } from "@/modules/auth/services/auth.service";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  resetPasswordSchema,
} from "@/modules/auth/validators/auth.validator";
import { getRequestContext } from "@/modules/auth/middlewares/auth.middleware";
import { parseDeviceType } from "@/modules/auth/utils/device.utils";
import { sendSuccess } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import { getParamId } from "@/shared/utils/request";

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input, {
      deviceType: parseDeviceType(req.headers["user-agent"]),
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });
    sendSuccess(res, result, "Login realizado com sucesso.");
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    sendSuccess(res, await authService.refresh(refreshToken), "Token renovado.");
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const input = logoutSchema.parse(req.body);
    const ctx = getRequestContext(req);
    await authService.logout(input.refreshToken, ctx.userId, input.allDevices, ctx.ip, ctx.userAgent);
    sendSuccess(res, null, "Logout realizado.");
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const ctx = getRequestContext(req);
    sendSuccess(res, await authService.getMe(ctx.userId!));
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const input = forgotPasswordSchema.parse(req.body);
    sendSuccess(res, await authService.forgotPassword(input, req.ip, req.headers["user-agent"]));
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const input = resetPasswordSchema.parse(req.body);
    sendSuccess(res, await authService.resetPassword(input, req.ip, req.headers["user-agent"]));
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    const input = changePasswordSchema.parse(req.body);
    const ctx = getRequestContext(req);
    sendSuccess(res, await authService.changePassword(ctx.userId!, input, ctx.ip, ctx.userAgent));
  }),

  sessions: asyncHandler(async (req: Request, res: Response) => {
    const ctx = getRequestContext(req);
    sendSuccess(res, await authService.listSessions(ctx.userId!, ctx.sessionId));
  }),

  revokeSession: asyncHandler(async (req: Request, res: Response) => {
    const ctx = getRequestContext(req);
    await authService.revokeSession(ctx.userId!, getParamId(req));
    sendSuccess(res, null, "Sessão encerrada.");
  }),
};

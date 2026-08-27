import { Router } from "express";
import { z } from "zod";
import { uploadService } from "@/shared/services/upload.service";
import { getRequestContext } from "@/shared/middlewares/auth.middleware";
import { sendCreated, sendSuccess } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import { validateParams } from "@/shared/middlewares/validate.middleware";
import { idParamSchema } from "@/shared/validators/common.validator";
import { getParamId } from "@/shared/utils/request";

const uploadBodySchema = z.object({
  categoria: z.enum(["DOCUMENTO", "CONTRATO", "LOGO", "IMAGEM", "PDF", "BRIEFING", "GRAVACAO", "OUTRO"]).optional(),
  nomeOriginal: z.string().min(1),
  mimeType: z.string().min(1),
  conteudoBase64: z.string().min(1),
});

/**
 * Rotas de upload — estrutura preparada.
 * Aceita conteúdo em base64 até integração com multipart/storage externo.
 */
export const uploadRoutes = Router();

uploadRoutes.post(
  "/",
  asyncHandler(async (req, res) => {
    const body = uploadBodySchema.parse(req.body);
    const buffer = Buffer.from(body.conteudoBase64, "base64");
    const ctx = getRequestContext(req);

    const record = await uploadService.upload({
      nomeOriginal: body.nomeOriginal,
      nomeArquivo: body.nomeOriginal.replace(/[^a-zA-Z0-9._-]/g, "_"),
      mimeType: body.mimeType,
      tamanho: buffer.length,
      categoria: body.categoria ?? "OUTRO",
      buffer,
      uploadedById: ctx.userId,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });

    sendCreated(res, record, "Upload realizado com sucesso.");
  })
);

uploadRoutes.get(
  "/:id",
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const upload = await uploadService.findById(getParamId(req));
    sendSuccess(res, upload);
  })
);

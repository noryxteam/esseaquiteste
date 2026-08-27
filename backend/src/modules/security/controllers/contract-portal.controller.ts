import type { Request } from "express";
import { getParamId } from "@/shared/utils/request";
import { contractPortalService } from "@/modules/security/services/contract-portal.service";
import {
  authorizeDevicePanelSchema,
  completeAccessSchema,
  portalSessionSchema,
  portalSignSchema,
  requestAccessSchema,
  validateCodeSchema,
} from "@/modules/security/validators/security.validator";
import { sendSuccess } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/async-handler";
import { ValidationError } from "@/shared/types/errors";

function getFingerprint(req: Request): string {
  const header = req.headers["x-device-fingerprint"];
  if (typeof header === "string" && header.length >= 16) return header;
  const body = req.body as { fingerprint?: string };
  return body.fingerprint ?? "";
}

export const contractPortalController = {
  resolve: asyncHandler(async (req, res) => {
    sendSuccess(res, await contractPortalService.resolveContract(getParamId(req, "slug")));
  }),

  document: asyncHandler(async (req, res) => {
    const fingerprint = getFingerprint(req);
    const portalTokenHeader = req.headers["x-portal-token"];
    const portalToken =
      typeof portalTokenHeader === "string"
        ? portalTokenHeader
        : typeof req.query.portalToken === "string"
          ? req.query.portalToken
          : undefined;
    const staffPreview = req.headers["x-norax-staff-preview"] === "1";

    sendSuccess(
      res,
      await contractPortalService.getDocument(
        getParamId(req, "slug"),
        fingerprint,
        portalToken,
        req.auth?.userId,
        staffPreview
      )
    );
  }),

  accessStatus: asyncHandler(async (req, res) => {
    const fingerprint = getFingerprint(req);
    const staffPreview = req.headers["x-norax-staff-preview"] === "1";
    sendSuccess(
      res,
      await contractPortalService.getAccessStatus(
        getParamId(req, "slug"),
        fingerprint,
        req.auth?.userId,
        staffPreview
      )
    );
  }),

  accessRequestStatus: asyncHandler(async (req, res) => {
    const fingerprint = getFingerprint(req);
    if (!fingerprint || fingerprint.length < 16) {
      throw new ValidationError("Fingerprint do dispositivo inválido.");
    }
    sendSuccess(
      res,
      await contractPortalService.getAccessRequestStatus(
        getParamId(req, "slug"),
        getParamId(req, "requestId"),
        fingerprint
      )
    );
  }),

  validateCode: asyncHandler(async (req, res) => {
    const input = validateCodeSchema.parse(req.body);
    sendSuccess(
      res,
      await contractPortalService.validateCode(
        getParamId(req, "slug"),
        input.code,
        input.fingerprint,
        req.headers["user-agent"],
        req.ip
      )
    );
  }),

  requestAccess: asyncHandler(async (req, res) => {
    const input = requestAccessSchema.parse(req.body);
    sendSuccess(
      res,
      await contractPortalService.requestAccess(
        getParamId(req, "slug"),
        input.fingerprint,
        req.headers["user-agent"],
        req.ip
      ),
      "Pedido de autorização enviado."
    );
  }),

  deviceDecision: asyncHandler(async (req, res) => {
    const token = getParamId(req, "token");
    const actionRaw = typeof req.query.action === "string" ? req.query.action : "";
    const action = actionRaw === "deny" ? "deny" : actionRaw === "approve" ? "approve" : null;
    if (!action) {
      res.status(400).type("html").send(
        "<!DOCTYPE html><html><body style='font-family:sans-serif;background:#0a0a0a;color:#fff;padding:40px;text-align:center'><h1>Ação inválida</h1><p>Use action=approve ou action=deny.</p></body></html>"
      );
      return;
    }
    const result = await contractPortalService.decideAccessFromEmail(token, action);
    if (result.redirectUrl) {
      res.redirect(302, result.redirectUrl);
      return;
    }
    res.status(200).type("html").send(result.html);
  }),

  authorizationPanel: asyncHandler(async (req, res) => {
    sendSuccess(
      res,
      await contractPortalService.getDeviceAuthorizationPanel(getParamId(req, "token"))
    );
  }),

  authorizeFromPanel: asyncHandler(async (req, res) => {
    const input = authorizeDevicePanelSchema.parse(req.body);
    sendSuccess(
      res,
      await contractPortalService.authorizeDeviceFromPanel(getParamId(req, "token"), input),
      "Dispositivo autorizado."
    );
  }),

  sign: asyncHandler(async (req, res) => {
    const input = portalSignSchema.parse(req.body);
    const portalTokenHeader = req.headers["x-portal-token"];
    const portalToken =
      input.portalToken ??
      (typeof portalTokenHeader === "string" ? portalTokenHeader : undefined);

    sendSuccess(
      res,
      await contractPortalService.signAsClient(
        getParamId(req, "slug"),
        input.fingerprint,
        portalToken,
        {
          nome: input.nome,
          documento: input.documento,
          data: input.data,
          hora: input.hora,
          aceiteEletronico: input.aceiteEletronico,
          role: input.role,
        },
        req.auth?.userId
      ),
      "Assinatura registrada."
    );
  }),

  completeAccess: asyncHandler(async (req, res) => {
    const input = completeAccessSchema.parse(req.body);
    sendSuccess(
      res,
      await contractPortalService.completeAccess(
        getParamId(req, "slug"),
        input.codeId,
        input.fingerprint,
        input.trustDevice,
        req.headers["user-agent"],
        req.ip
      ),
      "Acesso concedido."
    );
  }),

  verifySession: asyncHandler(async (req, res) => {
    const input = portalSessionSchema.parse(req.body);
    sendSuccess(
      res,
      await contractPortalService.verifyPortalSession(
        getParamId(req, "slug"),
        input.fingerprint,
        input.portalToken
      )
    );
  }),

  clientDevices: asyncHandler(async (req, res) => {
    const input = portalSessionSchema.parse(req.body);
    sendSuccess(
      res,
      await contractPortalService.getClientDevices(
        getParamId(req, "slug"),
        input.fingerprint,
        input.portalToken
      )
    );
  }),

  requestDeviceCode: asyncHandler(async (req, res) => {
    const input = portalSessionSchema.parse(req.body);
    sendSuccess(
      res,
      await contractPortalService.requestDeviceCode(
        getParamId(req, "slug"),
        input.fingerprint,
        input.portalToken
      ),
      "Código enviado para o e-mail cadastrado."
    );
  }),
};

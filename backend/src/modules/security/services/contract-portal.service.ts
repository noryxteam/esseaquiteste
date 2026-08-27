import { randomBytes } from "crypto";
import { ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/shared/types/errors";
import { env } from "@/config";
import { contractSecurityRepository } from "@/modules/security/repositories/contract-security.repository";
import { emailService } from "@/modules/security/services/email.service";
import { contractSecurityService } from "@/modules/security/services/contract-security.service";
import { trustedDeviceRepository } from "@/modules/security/repositories/trusted-device.repository";
import {
  DevicePermission,
  canSignContract,
  assertCanSign,
  DEVICE_PERMISSION_LABELS,
  isDevicePermission,
} from "@/modules/security/permissions/device-permission";
import {
  generateAccessCode,
  getCodeHint,
  hashAccessCode,
  normalizeAccessCode,
} from "@/modules/security/utils/access-code.utils";
import { resolveDeviceInfo } from "@/modules/security/utils/device-info.utils";
import { generatePortalToken } from "@/modules/security/utils/portal-token.utils";
import {
  mapContractToPortalDocument,
  mapContractToPortalMeta,
} from "@/modules/security/utils/portal-document.mapper";

const SESSION_ONLY_HOURS = 8;
const TRUSTED_SESSION_DAYS = 365;
const ACCESS_REQUEST_HOURS = 2;

function formatDateBR(date: Date): string {
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function decisionUrl(token: string, action: "approve" | "deny"): string {
  return `${env.API_PUBLIC_URL}/contracts/portal/device-decision/${token}?action=${action}`;
}

/** Página mínima onde o cliente escolhe Visualizador ou Assinante. */
function authorizationPageUrl(approveToken: string): string {
  return `${env.APP_PUBLIC_URL}/contract/autorizar-dispositivo/${approveToken}`;
}

function resolveNotificationEmail(cliente: {
  email: string;
  setupData: unknown;
}): string {
  const setup = cliente.setupData as { emailRecuperacao?: string } | null;
  const fromSetup = setup?.emailRecuperacao?.trim();
  if (fromSetup && fromSetup.includes("@") && !fromSetup.endsWith("@norax.local")) {
    return fromSetup;
  }
  return cliente.email;
}

function decisionHtml(title: string, message: string, ok: boolean): string {
  const color = ok ? "#22c55e" : "#ef4444";
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fafafa;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:420px;padding:32px;text-align:center;border:1px solid #222;border-radius:16px;background:#111;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Norax</p>
    <h1 style="margin:0 0 12px;font-size:22px;color:${color};">${title}</h1>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#a1a1aa;">${message}</p>
  </div>
</body></html>`;
}

export class ContractPortalService {
  /** Resolve o contrato no banco pelo ID/slug da URL — sem depender de sessão ou dispositivo. */
  async resolveContract(slug: string) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");
    return mapContractToPortalMeta(contract);
  }

  /**
   * Retorna o documento completo somente se o dispositivo/sessão estiver autorizado.
   * Contrato inexistente → 404. Sem autorização → 401 (nunca 404).
   */
  async getDocument(
    slug: string,
    fingerprint: string,
    portalToken?: string,
    userId?: string,
    staffPreview = false
  ) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    const access = await this.getAccessStatus(slug, fingerprint, userId, staffPreview);
    if (access.authorized) {
      return mapContractToPortalDocument(contract);
    }

    if (portalToken) {
      try {
        await this.verifyPortalSession(slug, fingerprint, portalToken);
        return mapContractToPortalDocument(contract);
      } catch {
        // segue para unauthorized
      }
    }

    throw new UnauthorizedError(
      "Dispositivo não autorizado. Solicite acesso com o código.",
      "DEVICE_NOT_AUTHORIZED"
    );
  }

  private async ensurePortalToken(
    contractId: string,
    fingerprint: string,
    sessionType: import("@prisma/client").PortalSessionType,
    deviceId?: string
  ): Promise<string> {
    const existing = await contractSecurityRepository.findActivePortalSessionByFingerprint(
      contractId,
      fingerprint
    );
    if (existing) {
      await contractSecurityRepository.touchPortalSession(existing.id);
      return existing.token;
    }

    const token = generatePortalToken();
    const expiresAt =
      sessionType === "TRUSTED_DEVICE"
        ? new Date(Date.now() + TRUSTED_SESSION_DAYS * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + SESSION_ONLY_HOURS * 60 * 60 * 1000);

    const session = await contractSecurityRepository.createPortalSession({
      contractId,
      fingerprint,
      token,
      sessionType,
      expiresAt,
      deviceId,
    });

    return session.token;
  }

  async getAccessStatus(slug: string, fingerprint: string, userId?: string, staffPreview = false) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    // Preview do painel Norax — só com header explícito + staff autenticado.
    // Link do cliente NUNCA manda esse header → nunca libera contrato de outra pessoa.
    if (userId && staffPreview) {
      const trusted = await trustedDeviceRepository.findByUserAndFingerprint(userId, fingerprint);
      if (trusted) {
        await trustedDeviceRepository.update(trusted.id, {
          ultimoAcesso: new Date(),
        });
      }
      const portalToken = await this.ensurePortalToken(
        contract.id,
        fingerprint,
        "TRUSTED_DEVICE"
      );
      await this.logLastAccess(contract.id, undefined, fingerprint);
      return {
        authorized: true,
        requiresCode: false,
        trustedNoraxDevice: true,
        permission: DevicePermission.SIGNER,
        canSign: true,
        canDownloadPdf: true,
        contractId: contract.id,
        slug: contract.uniqueSlug,
        contractNumber: contract.numeroContrato,
        clientName: contract.cliente.nome,
        portalToken,
      };
    }

    // Autorização estrita: dispositivo ACTIVE neste contrato (contractId), nada mais.
    const device = await contractSecurityRepository.findDeviceByFingerprint(contract.id, fingerprint);
    if (device?.status === "ACTIVE" && !device.sessionOnly) {
      await contractSecurityRepository.updateDevice(device.id, { ultimoAcesso: new Date() });
      const portalToken = await this.ensurePortalToken(
        contract.id,
        fingerprint,
        "TRUSTED_DEVICE",
        device.id
      );
      await this.logLastAccess(contract.id, device.id, fingerprint);
      return {
        authorized: true,
        requiresCode: false,
        trustedDevice: true,
        deviceLabel: device.label,
        permission: device.permission,
        canSign: canSignContract(device.permission),
        canDownloadPdf: true,
        contractId: contract.id,
        slug: contract.uniqueSlug,
        contractNumber: contract.numeroContrato,
        clientName: contract.cliente.nome,
        portalToken,
      };
    }

    // Acesso é por CONTRATO — não herda autorização de outro contrato do mesmo cliente.

    const existingSession = await contractSecurityRepository.findActivePortalSessionByFingerprint(
      contract.id,
      fingerprint
    );
    if (existingSession) {
      await contractSecurityRepository.touchPortalSession(existingSession.id);
      const sessionDevice = existingSession.deviceId
        ? await contractSecurityRepository.findDevice(contract.id, existingSession.deviceId)
        : null;
      const permission = sessionDevice?.permission ?? DevicePermission.VIEWER;
      return {
        authorized: true,
        requiresCode: false,
        permission,
        canSign: canSignContract(permission),
        canDownloadPdf: true,
        contractId: contract.id,
        slug: contract.uniqueSlug,
        contractNumber: contract.numeroContrato,
        clientName: contract.cliente.nome,
        portalToken: existingSession.token,
      };
    }

    await contractSecurityRepository.expireStaleAccessRequests(contract.id);
    const pending = await contractSecurityRepository.findPendingAccessRequest(
      contract.id,
      fingerprint
    );
    if (pending) {
      return {
        authorized: false,
        requiresCode: false,
        pendingApproval: true,
        requestId: pending.id,
        requestStatus: pending.status,
        contractId: contract.id,
        slug: contract.uniqueSlug,
        contractNumber: contract.numeroContrato,
        clientName: contract.cliente.nome,
      };
    }

    return {
      authorized: false,
      requiresCode: false,
      requiresAuthorization: true,
      contractId: contract.id,
      slug: contract.uniqueSlug,
      contractNumber: contract.numeroContrato,
      clientName: contract.cliente.nome,
    };
  }

  /**
   * Pedido de acesso sem código: cria solicitação PENDING e envia e-mail ao proprietário.
   */
  async requestAccess(
    slug: string,
    fingerprint: string,
    userAgent?: string,
    ip?: string
  ) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    await contractSecurityRepository.expireStaleAccessRequests(contract.id);

    const existingDevice = await contractSecurityRepository.findDeviceByFingerprint(
      contract.id,
      fingerprint
    );
    if (existingDevice?.status === "ACTIVE") {
      const portalToken = await this.ensurePortalToken(
        contract.id,
        fingerprint,
        "TRUSTED_DEVICE",
        existingDevice.id
      );
      return {
        valid: true,
        requestId: null as string | null,
        status: "approved" as const,
        pendingApproval: false,
        permission: existingDevice.permission,
        canSign: canSignContract(existingDevice.permission),
        portalToken,
        contractId: contract.id,
        slug: contract.uniqueSlug,
      };
    }

    const existingPending = await contractSecurityRepository.findPendingAccessRequest(
      contract.id,
      fingerprint
    );
    if (existingPending) {
      return {
        valid: true,
        requestId: existingPending.id,
        status: "pending" as const,
        pendingApproval: true,
        notifiedEmail: existingPending.notifiedEmail,
        emailSent: true,
        contractId: contract.id,
        slug: contract.uniqueSlug,
      };
    }

    return this.createPendingAccessAndNotify({
      contract,
      fingerprint,
      userAgent,
      ip,
    });
  }

  /**
   * Código staff → cria solicitação PENDING + e-mail.
   * Código CLIENT_AUTHORIZED (com permissão) → cria Device ID + salva permissão.
   */
  async validateCode(
    slug: string,
    codeInput: string,
    fingerprint: string,
    userAgent?: string,
    ip?: string
  ) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    await contractSecurityRepository.expireStaleCodes(contract.id);
    await contractSecurityRepository.expireStaleAccessRequests(contract.id);

    const normalized = normalizeAccessCode(codeInput);
    const codeHash = hashAccessCode(normalized);
    const accessCode = await contractSecurityRepository.findActiveCodeByHash(contract.id, codeHash);

    if (!accessCode) {
      throw new UnauthorizedError("Código inválido ou expirado.", "INVALID_ACCESS_CODE");
    }

    // Código emitido pelo cliente com permissão — ativa o dispositivo imediatamente
    if (accessCode.source === "CLIENT_AUTHORIZED" && accessCode.permission) {
      if (accessCode.fingerprintBound && accessCode.fingerprintBound !== fingerprint) {
        throw new ForbiddenError(
          "Este código é exclusivo do dispositivo que solicitou o acesso.",
          "CODE_DEVICE_MISMATCH"
        );
      }

      return this.activateDeviceFromPermissionCode({
        contractId: contract.id,
        slug: contract.uniqueSlug,
        accessCode,
        fingerprint,
        userAgent,
        ip,
        labelFallback: resolveDeviceInfo(fingerprint, userAgent, ip).label,
      });
    }

    const existingDevice = await contractSecurityRepository.findDeviceByFingerprint(
      contract.id,
      fingerprint
    );
    if (existingDevice?.status === "ACTIVE") {
      const portalToken = await this.ensurePortalToken(
        contract.id,
        fingerprint,
        "TRUSTED_DEVICE",
        existingDevice.id
      );
      return {
        valid: true,
        codeId: accessCode.id,
        requestId: null,
        status: "approved" as const,
        pendingApproval: false,
        permission: existingDevice.permission,
        canSign: canSignContract(existingDevice.permission),
        portalToken,
        contractId: contract.id,
        slug: contract.uniqueSlug,
      };
    }

    const existingPending = await contractSecurityRepository.findPendingAccessRequest(
      contract.id,
      fingerprint
    );
    if (existingPending) {
      return {
        valid: true,
        codeId: accessCode.id,
        requestId: existingPending.id,
        status: "pending" as const,
        pendingApproval: true,
        notifiedEmail: existingPending.notifiedEmail,
        contractId: contract.id,
        slug: contract.uniqueSlug,
      };
    }

    return this.createPendingAccessAndNotify({
      contract,
      fingerprint,
      userAgent,
      ip,
      codeId: accessCode.id,
    });
  }

  private async createPendingAccessAndNotify(input: {
    contract: {
      id: string;
      uniqueSlug: string;
      numeroContrato: string;
      titulo: string;
      cliente: { nome: string; email: string; setupData: unknown };
    };
    fingerprint: string;
    userAgent?: string;
    ip?: string;
    codeId?: string;
  }) {
    const { contract, fingerprint, userAgent, ip, codeId } = input;

    await contractSecurityRepository.cancelPendingAccessRequests(contract.id, fingerprint);

    const deviceInfo = resolveDeviceInfo(fingerprint, userAgent, ip);
    const approveToken = randomBytes(24).toString("hex");
    const denyToken = randomBytes(24).toString("hex");
    const notifiedEmail = resolveNotificationEmail(contract.cliente);

    if (!notifiedEmail.includes("@") || notifiedEmail.endsWith("@norax.local")) {
      throw new ValidationError(
        "Cliente sem e-mail de notificação. Preencha o e-mail na ficha do cliente."
      );
    }

    const request = await contractSecurityRepository.createAccessRequest({
      contractId: contract.id,
      codeId,
      fingerprint,
      label: deviceInfo.label,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      deviceType: deviceInfo.deviceType,
      ip,
      userAgent,
      approveToken,
      denyToken,
      notifiedEmail,
      expiresAt: new Date(Date.now() + ACCESS_REQUEST_HOURS * 60 * 60 * 1000),
    });

    await contractSecurityRepository.createSecurityEvent({
      contractId: contract.id,
      eventType: "DEVICE_ACCESS_REQUESTED",
      description: `Solicitação de acesso: ${deviceInfo.label}`,
      ip,
      userAgent,
      metadata: { requestId: request.id, email: notifiedEmail },
    });

    const requestedAt = formatDateBR(new Date());
    const authorizeUrl = authorizationPageUrl(approveToken);
    const denyUrl = decisionUrl(denyToken, "deny");

    const emailSent = await emailService.sendDeviceAuthorizationEmail({
      to: notifiedEmail,
      clientName: contract.cliente.nome,
      contractNumber: contract.numeroContrato,
      contractTitle: contract.titulo,
      deviceLabel: deviceInfo.label,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      requestedAt,
      authorizeUrl,
      denyUrl,
      ip,
    });

    if (!emailSent) {
      console.info("\n📧 [FALLBACK] Links de autorização (SMTP falhou — use estes):");
      console.info(`Autorizar: ${authorizeUrl}`);
      console.info(`Negar:     ${denyUrl}`);
      console.info(`Para: ${notifiedEmail}\n`);
    }

    return {
      valid: true,
      codeId: codeId ?? null,
      requestId: request.id,
      status: "pending" as const,
      pendingApproval: true,
      notifiedEmail,
      emailSent,
      contractId: contract.id,
      slug: contract.uniqueSlug,
      askTrustDevice: false,
      deviceInfo,
    };
  }

  private async activateDeviceFromPermissionCode(input: {
    contractId: string;
    slug: string;
    accessCode: {
      id: string;
      permission: DevicePermission | null;
      accessRequestId: string | null;
    };
    fingerprint: string;
    userAgent?: string;
    ip?: string;
    labelFallback: string;
  }) {
    const permission = input.accessCode.permission;
    if (!permission || !isDevicePermission(permission)) {
      throw new ValidationError("Código sem permissão válida.");
    }

    let label = input.labelFallback;
    let os: string | undefined;
    let browser: string | undefined;
    let deviceType: import("@prisma/client").DeviceType = "UNKNOWN";

    if (input.accessCode.accessRequestId) {
      const req = await contractSecurityRepository.findAccessRequestById(
        input.accessCode.accessRequestId
      );
      if (req) {
        label = req.label;
        os = req.os ?? undefined;
        browser = req.browser ?? undefined;
        deviceType = req.deviceType;
      }
    } else {
      const info = resolveDeviceInfo(input.fingerprint, input.userAgent, input.ip);
      label = info.label;
      os = info.os;
      browser = info.browser;
      deviceType = info.deviceType;
    }

    const existing = await contractSecurityRepository.findDeviceByFingerprint(
      input.contractId,
      input.fingerprint
    );

    let deviceId: string;
    if (existing) {
      await contractSecurityRepository.updateDevice(existing.id, {
        status: "ACTIVE",
        revokedAt: null,
        sessionOnly: false,
        permission,
        ultimoAcesso: new Date(),
        label,
        os,
        browser,
        ip: input.ip,
      });
      deviceId = existing.id;
    } else {
      const created = await contractSecurityRepository.createDevice({
        contractId: input.contractId,
        fingerprint: input.fingerprint,
        label,
        os,
        browser,
        deviceType,
        ip: input.ip,
        sessionOnly: false,
        aprovadoPor: "client-permission-code",
        permission,
      });
      deviceId = created.id;
      await contractSecurityRepository.createSecurityEvent({
        contractId: input.contractId,
        eventType: "DEVICE_AUTHORIZED",
        description: `Dispositivo autorizado (${DEVICE_PERMISSION_LABELS[permission]}): ${label}`,
        deviceId: created.id,
      });
      await contractSecurityRepository.createSecurityEvent({
        contractId: input.contractId,
        eventType: "FIRST_ACCESS",
        description: `Primeiro acesso: ${label}`,
        deviceId: created.id,
      });
    }

    await contractSecurityRepository.updateAccessCode(input.accessCode.id, {
      status: "USED",
      usedAt: new Date(),
      active: false,
    });

    if (input.accessCode.accessRequestId) {
      await contractSecurityRepository.updateAccessRequest(input.accessCode.accessRequestId, {
        deliveryCode: null,
      });
    }

    await contractSecurityRepository.createSecurityEvent({
      contractId: input.contractId,
      eventType: "CODE_USED",
      description: `Código de permissão utilizado (${DEVICE_PERMISSION_LABELS[permission]})`,
      deviceId,
      metadata: { codeId: input.accessCode.id, permission },
    });

    const portalToken = await this.ensurePortalToken(
      input.contractId,
      input.fingerprint,
      "TRUSTED_DEVICE",
      deviceId
    );

    return {
      valid: true,
      codeId: input.accessCode.id,
      requestId: input.accessCode.accessRequestId,
      status: "approved" as const,
      pendingApproval: false,
      permission,
      canSign: canSignContract(permission),
      portalToken,
      contractId: input.contractId,
      slug: input.slug,
      deviceId,
    };
  }

  async getAccessRequestStatus(slug: string, requestId: string, fingerprint: string) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    const request = await contractSecurityRepository.findAccessRequestById(requestId);
    if (!request || request.contractId !== contract.id) {
      throw new NotFoundError("Solicitação não encontrada.", "ACCESS_REQUEST_NOT_FOUND");
    }
    if (request.fingerprint !== fingerprint) {
      throw new UnauthorizedError("Solicitação não pertence a este dispositivo.", "FINGERPRINT_MISMATCH");
    }

    if (request.status === "PENDING" && request.expiresAt <= new Date()) {
      await contractSecurityRepository.updateAccessRequest(request.id, {
        status: "EXPIRED",
        decidedAt: new Date(),
      });
      return { status: "EXPIRED" as const, requestId: request.id, authorized: false };
    }

    if (request.status === "APPROVED") {
      // Entrega one-time do código de permissão ao dispositivo solicitante
      let authorizationCode: string | undefined;
      if (request.deliveryCode) {
        authorizationCode = request.deliveryCode;
        await contractSecurityRepository.updateAccessRequest(request.id, {
          deliveryCode: null,
        });
      }

      const device = await contractSecurityRepository.findDeviceByFingerprint(
        contract.id,
        fingerprint
      );
      if (device?.status === "ACTIVE") {
        const portalToken = await this.ensurePortalToken(
          contract.id,
          fingerprint,
          "TRUSTED_DEVICE",
          device.id
        );
        return {
          status: "APPROVED" as const,
          requestId: request.id,
          authorized: true,
          permission: device.permission,
          canSign: canSignContract(device.permission),
          portalToken,
        };
      }

      return {
        status: "APPROVED" as const,
        requestId: request.id,
        authorized: false,
        pendingCodeUse: true,
        authorizationCode,
        permission: request.grantedPermission ?? undefined,
      };
    }

    return {
      status: request.status,
      requestId: request.id,
      authorized: false,
    };
  }

  /** Clique no e-mail: approve → página simples de permissão; deny → bloqueia na hora. */
  async decideAccessFromEmail(token: string, action: "approve" | "deny"): Promise<{ html: string; redirectUrl?: string }> {
    if (action === "approve") {
      const request = await contractSecurityRepository.findAccessRequestByApproveToken(token);
      if (!request) {
        return {
          html: decisionHtml(
            "Link inválido",
            "Esta solicitação não existe ou o link já expirou.",
            false
          ),
        };
      }
      const page = authorizationPageUrl(request.approveToken);
      return {
        redirectUrl: page,
        html: decisionHtml(
          "Redirecionando…",
          `Abrindo a autorização. Se não abrir, <a href="${page}" style="color:#93c5fd">clique aqui</a>.`,
          true
        ),
      };
    }

    const request = await contractSecurityRepository.findAccessRequestByDecisionToken(token);
    if (!request) {
      return {
        html: decisionHtml(
          "Link inválido",
          "Esta solicitação não existe ou o link já expirou.",
          false
        ),
      };
    }

    if (request.status !== "PENDING") {
      const already =
        request.status === "APPROVED"
          ? "Esta solicitação já foi autorizada."
          : request.status === "DENIED"
            ? "Esta solicitação já foi negada."
            : "Esta solicitação expirou.";
      return { html: decisionHtml("Já processado", already, request.status === "APPROVED") };
    }

    if (request.expiresAt <= new Date()) {
      await contractSecurityRepository.updateAccessRequest(request.id, {
        status: "EXPIRED",
        decidedAt: new Date(),
      });
      return {
        html: decisionHtml("Expirado", "Esta solicitação expirou. Peça um novo código de acesso.", false),
      };
    }

    if (token !== request.denyToken) {
      return {
        html: decisionHtml("Link inválido", "O link de decisão não corresponde a esta ação.", false),
      };
    }

    await contractSecurityRepository.updateAccessRequest(request.id, {
      status: "DENIED",
      decidedAt: new Date(),
    });
    await contractSecurityRepository.createSecurityEvent({
      contractId: request.contractId,
      eventType: "DEVICE_ACCESS_DENIED",
      description: `Acesso negado: ${request.label}`,
      metadata: { requestId: request.id },
    });
    return {
      html: decisionHtml(
        "Acesso negado",
        "Você recusou o acesso deste dispositivo. A pessoa que tentou entrar verá que não foi autorizada.",
        false
      ),
    };
  }

  /** Dados da página simples de autorização (somente com approveToken do e-mail). */
  async getDeviceAuthorizationPanel(approveToken: string) {
    const request = await contractSecurityRepository.findAccessRequestByApproveToken(approveToken);
    if (!request) {
      throw new NotFoundError("Solicitação não encontrada.", "ACCESS_REQUEST_NOT_FOUND");
    }

    if (request.expiresAt <= new Date() && request.status === "PENDING") {
      await contractSecurityRepository.updateAccessRequest(request.id, {
        status: "EXPIRED",
        decidedAt: new Date(),
      });
    }

    const fresh = await contractSecurityRepository.findAccessRequestByApproveToken(approveToken);
    if (!fresh) throw new NotFoundError("Solicitação não encontrada.", "ACCESS_REQUEST_NOT_FOUND");

    return {
      requestId: fresh.id,
      status: fresh.status,
      contractId: fresh.contractId,
      contractNumber: fresh.contract.numeroContrato,
      contractTitle: fresh.contract.titulo,
      clientName: fresh.contract.cliente.nome,
      companyName: fresh.contract.cliente.empresa,
      device: {
        label: fresh.label,
        os: fresh.os ?? "—",
        browser: fresh.browser ?? "—",
        deviceType: fresh.deviceType,
        ip: fresh.ip ?? "—",
      },
      requestedAt: formatDateBR(fresh.createdAt),
      expiresAt: formatDateBR(fresh.expiresAt),
      canDecide: fresh.status === "PENDING",
      grantedPermission: fresh.grantedPermission,
      permissions: [
        {
          id: DevicePermission.VIEWER,
          label: DEVICE_PERMISSION_LABELS.VIEWER,
          description: "Pode apenas visualizar e baixar o contrato.",
        },
        {
          id: DevicePermission.SIGNER,
          label: DEVICE_PERMISSION_LABELS.SIGNER,
          description: "Pode visualizar, baixar e assinar o contrato.",
        },
      ],
    };
  }

  /**
   * Cliente autoriza na página do e-mail: registra permissão, vincula dispositivo ao contrato
   * e conclui a solicitação. Códigos internos são gerados só para auditoria — nunca expostos.
   * O navegador em "Aguardando autorização" libera via polling.
   */
  async authorizeDeviceFromPanel(
    approveToken: string,
    input: { permission: DevicePermission }
  ) {
    const request = await contractSecurityRepository.findAccessRequestByApproveToken(approveToken);
    if (!request) {
      throw new NotFoundError("Solicitação não encontrada.", "ACCESS_REQUEST_NOT_FOUND");
    }
    if (request.status !== "PENDING") {
      throw new ValidationError("Esta solicitação já foi decidida.");
    }
    if (request.expiresAt <= new Date()) {
      await contractSecurityRepository.updateAccessRequest(request.id, {
        status: "EXPIRED",
        decidedAt: new Date(),
      });
      throw new ValidationError("Esta solicitação expirou.");
    }

    if (!isDevicePermission(input.permission)) {
      throw new ValidationError("Selecione a permissão do dispositivo (Visualizador ou Assinante).");
    }

    const plainCode = generateAccessCode();
    const codeHash = hashAccessCode(plainCode);
    const expiresAt = new Date(Date.now() + ACCESS_REQUEST_HOURS * 60 * 60 * 1000);

    const accessCode = await contractSecurityRepository.createAccessCode({
      contractId: request.contractId,
      codeHash,
      codeHint: getCodeHint(plainCode),
      expiresAt,
      source: "CLIENT_AUTHORIZED",
      permission: input.permission,
      fingerprintBound: request.fingerprint,
      accessRequestId: request.id,
      active: true,
    });

    await contractSecurityRepository.updateAccessRequest(request.id, {
      status: "APPROVED",
      decidedAt: new Date(),
      grantedPermission: input.permission,
      issuedCodeId: accessCode.id,
      deliveryCode: null,
    });

    if (request.codeId) {
      await contractSecurityRepository.updateAccessCode(request.codeId, {
        status: "USED",
        usedAt: new Date(),
        active: false,
      });
    }

    await this.activateDeviceFromPermissionCode({
      contractId: request.contractId,
      slug: request.contract.uniqueSlug,
      accessCode: {
        id: accessCode.id,
        permission: input.permission,
        accessRequestId: request.id,
      },
      fingerprint: request.fingerprint,
      userAgent: request.userAgent ?? undefined,
      ip: request.ip ?? undefined,
      labelFallback: request.label,
    });

    await contractSecurityRepository.createSecurityEvent({
      contractId: request.contractId,
      eventType: "DEVICE_ACCESS_APPROVED",
      description: `Autorizado por e-mail com permissão ${DEVICE_PERMISSION_LABELS[input.permission]}: ${request.label}`,
      metadata: {
        requestId: request.id,
        permission: input.permission,
        codeId: accessCode.id,
      },
    });

    return {
      status: "APPROVED" as const,
      requestId: request.id,
      permission: input.permission,
      permissionLabel: DEVICE_PERMISSION_LABELS[input.permission],
      message: "Dispositivo autorizado. O solicitante será liberado automaticamente.",
    };
  }

  /** Assinatura do cliente no portal — valida permissão SIGNER no backend. */
  async signAsClient(
    slug: string,
    fingerprint: string,
    portalToken: string | undefined,
    signature: {
      nome: string;
      documento: string;
      data?: string;
      hora?: string;
      aceiteEletronico: boolean;
    },
    userId?: string
  ) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    const access = await this.getAccessStatus(slug, fingerprint, userId);
    if (!access.authorized) {
      if (portalToken) {
        await this.verifyPortalSession(slug, fingerprint, portalToken);
      } else {
        throw new UnauthorizedError("Dispositivo não autorizado.", "DEVICE_NOT_AUTHORIZED");
      }
    }

    const device = await contractSecurityRepository.findDeviceByFingerprint(
      contract.id,
      fingerprint
    );
    const permission =
      userId && access.trustedNoraxDevice
        ? DevicePermission.SIGNER
        : device?.permission ??
          ("permission" in access ? (access.permission as DevicePermission | undefined) : null) ??
          null;

    assertCanSign(permission);

    // Persistência de assinatura no Prisma (registro oficial)
    const { prisma } = await import("@/database");
    const existing = await prisma.contractSignatureRecord.findFirst({
      where: { contractId: contract.id, role: "cliente" },
    });
    if (existing) {
      throw new ValidationError("Cliente já assinou este contrato.");
    }

    await prisma.contractSignatureRecord.create({
      data: {
        contractId: contract.id,
        role: "cliente",
        nome: signature.nome,
        documento: signature.documento,
        aceiteEletronico: signature.aceiteEletronico,
      },
    });

    const all = await prisma.contractSignatureRecord.findMany({
      where: { contractId: contract.id },
      select: { role: true },
    });
    const roles = new Set(all.map((s) => s.role.toLowerCase()));
    const hasNorax = roles.has("norax") || roles.has("empresa");
    const hasCliente = roles.has("cliente");

    if (hasNorax && hasCliente) {
      await prisma.contract.update({
        where: { id: contract.id },
        data: { status: "ASSINADO", dataAssinatura: new Date(), assinado: true },
      });
    } else {
      await prisma.contract.update({
        where: { id: contract.id },
        data: { status: "PARCIALMENTE_ASSINADO" },
      });
    }

    await contractSecurityRepository.createSecurityEvent({
      contractId: contract.id,
      eventType: "LAST_ACCESS",
      description: `Assinatura do cliente registrada: ${signature.nome}`,
      deviceId: device?.id,
      metadata: { permission, role: "cliente" },
    });

    return {
      signed: true,
      role: "cliente" as const,
      permission,
      nome: signature.nome,
      documento: signature.documento,
      hasNorax,
      fullySigned: hasNorax && hasCliente,
    };
  }

  /** Mantido para compatibilidade — fluxo principal agora é e-mail + painel. */
  async completeAccess(
    slug: string,
    _codeId: string,
    fingerprint: string,
    _trustDevice: boolean,
    _userAgent?: string,
    _ip?: string
  ) {
    const pending = await this.getAccessStatus(slug, fingerprint);
    if (pending.authorized && pending.portalToken) {
      return {
        portalToken: pending.portalToken,
        sessionType: "TRUSTED_DEVICE" as const,
        expiresAt: formatDateBR(new Date(Date.now() + TRUSTED_SESSION_DAYS * 24 * 60 * 60 * 1000)),
        trustedDevice: true,
        permission: pending.permission,
        canSign: pending.canSign,
      };
    }

    throw new UnauthorizedError(
      "Aguarde a autorização pelo e-mail do cliente.",
      "PENDING_EMAIL_APPROVAL"
    );
  }

  async verifyPortalSession(slug: string, fingerprint: string, portalToken: string) {
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    const session = await contractSecurityRepository.findValidPortalSession(
      contract.id,
      portalToken,
      fingerprint
    );

    if (!session) {
      throw new UnauthorizedError("Sessão inválida ou expirada.", "PORTAL_SESSION_INVALID");
    }

    if (session.sessionType === "TRUSTED_DEVICE" && session.device?.status === "REVOKED") {
      await contractSecurityRepository.revokePortalSessions(contract.id, fingerprint);
      throw new UnauthorizedError("Dispositivo revogado.", "DEVICE_REVOKED");
    }

    await contractSecurityRepository.touchPortalSession(session.id);
    if (session.deviceId) {
      await contractSecurityRepository.updateDevice(session.deviceId, { ultimoAcesso: new Date() });
    }

    await this.logLastAccess(contract.id, session.deviceId ?? undefined, fingerprint);

    return {
      valid: true,
      contractId: contract.id,
      sessionType: session.sessionType,
    };
  }

  async getClientDevices(slug: string, fingerprint: string, portalToken: string) {
    await this.verifyPortalSession(slug, fingerprint, portalToken);
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    const devices = await contractSecurityRepository.listDevices(contract.id);
    return {
      connectedCount: devices.filter((d) => d.status === "ACTIVE" && !d.sessionOnly).length,
      devices: devices
        .filter((d) => d.status === "ACTIVE" && !d.sessionOnly)
        .map((d) => ({
          id: d.id,
          label: d.label,
          deviceType: d.deviceType,
          lastAccess: formatDateBR(d.ultimoAcesso),
          isCurrent: d.fingerprint === fingerprint,
        })),
    };
  }

  async requestDeviceCode(slug: string, fingerprint: string, portalToken: string) {
    await this.verifyPortalSession(slug, fingerprint, portalToken);
    const contract = await contractSecurityRepository.findContractBySlug(slug);
    if (!contract) throw new NotFoundError("Contrato não encontrado.", "CONTRACT_NOT_FOUND");

    return contractSecurityService.requestClientDeviceCode(contract.id);
  }

  private async logLastAccess(
    contractId: string,
    deviceId?: string,
    fingerprint?: string,
    ip?: string,
    userAgent?: string
  ) {
    await contractSecurityRepository.createSecurityEvent({
      contractId,
      eventType: "LAST_ACCESS",
      description: "Acesso ao contrato",
      deviceId,
      ip,
      userAgent,
      metadata: fingerprint ? { fingerprint } : undefined,
    });
  }
}

export const contractPortalService = new ContractPortalService();

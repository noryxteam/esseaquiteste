import { apiFetch, portalApiFetch, publicApiFetch } from "@/modules/auth/api/auth.api";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import type {
  AccessCode,
  AuthorizedDevice,
  ContractSecurityOverview,
  GeneratedAccessCode,
  SecurityTimelineEvent,
  PortalAccessStatus,
  PortalContractMeta,
  PortalSessionResult,
  ClientDevice,
  TrustedDevice,
  CodeValidity,
} from "@/modules/security/types";

const securityBase = (contractId: string) => `/contracts/${contractId}/security`;
const portalBase = (slug: string) => `/contracts/portal/${slug}`;

export const securityApi = {
  getOverview(contractId: string) {
    return apiFetch<ContractSecurityOverview>(`${securityBase(contractId)}/overview`);
  },

  listDevices(contractId: string) {
    return apiFetch<AuthorizedDevice[]>(`${securityBase(contractId)}/devices`);
  },

  getDeviceDetails(contractId: string, deviceId: string) {
    return apiFetch<AuthorizedDevice>(`${securityBase(contractId)}/devices/${deviceId}`);
  },

  renameDevice(contractId: string, deviceId: string, label: string) {
    return apiFetch<{ id: string; label: string }>(
      `${securityBase(contractId)}/devices/${deviceId}`,
      { method: "PATCH", body: JSON.stringify({ label }) }
    );
  },

  revokeDevice(contractId: string, deviceId: string) {
    return apiFetch<{ success: boolean }>(
      `${securityBase(contractId)}/devices/${deviceId}/revoke`,
      { method: "POST" }
    );
  },

  generateCode(contractId: string, validity: CodeValidity, customMinutes?: number) {
    return apiFetch<GeneratedAccessCode>(`${securityBase(contractId)}/codes`, {
      method: "POST",
      body: JSON.stringify({ validity, customMinutes }),
    });
  },

  listCodes(contractId: string) {
    return apiFetch<AccessCode[]>(`${securityBase(contractId)}/codes`);
  },

  cancelCode(contractId: string, codeId: string) {
    return apiFetch<{ success: boolean }>(
      `${securityBase(contractId)}/codes/${codeId}/cancel`,
      { method: "POST" }
    );
  },

  getTimeline(contractId: string) {
    return apiFetch<SecurityTimelineEvent[]>(`${securityBase(contractId)}/timeline`);
  },

  listPendingRequests(contractId: string) {
    return apiFetch<import("@/modules/security/types").PendingDeviceRequest[]>(
      `${securityBase(contractId)}/pending-requests`
    );
  },

  listAuthorizationHistory(contractId: string) {
    return apiFetch<import("@/modules/security/types").AuthorizationHistoryEntry[]>(
      `${securityBase(contractId)}/authorization-history`
    );
  },
};

export const portalApi = {
  /** Busca o contrato no banco pelo ID/slug da URL. */
  resolve(slug: string) {
    return publicApiFetch<PortalContractMeta>(`${portalBase(slug)}`);
  },

  /** Documento completo — só após autorização do dispositivo (ou preview staff explícito). */
  getDocument(
    slug: string,
    fingerprint: string,
    portalToken?: string,
    opts?: { staffPreview?: boolean }
  ) {
    const headers: Record<string, string> = {
      "X-Device-Fingerprint": fingerprint,
    };
    if (portalToken) headers["X-Portal-Token"] = portalToken;
    if (opts?.staffPreview) headers["X-Norax-Staff-Preview"] = "1";

    // Sem staffPreview: NÃO envia JWT — evita liberar contrato alheio só por estar logado no painel
    if (opts?.staffPreview) {
      return portalApiFetch<ContractDocumentData>(
        `${portalBase(slug)}/document`,
        { headers },
        15_000
      );
    }
    return publicApiFetch<ContractDocumentData>(
      `${portalBase(slug)}/document`,
      { headers },
      15_000
    );
  },

  getAccessStatus(
    slug: string,
    fingerprint: string,
    opts?: { staffPreview?: boolean }
  ) {
    const headers: Record<string, string> = {
      "X-Device-Fingerprint": fingerprint,
    };
    if (opts?.staffPreview) headers["X-Norax-Staff-Preview"] = "1";

    if (opts?.staffPreview) {
      return portalApiFetch<PortalAccessStatus>(`${portalBase(slug)}/access-status`, {
        headers,
      });
    }
    return publicApiFetch<PortalAccessStatus>(`${portalBase(slug)}/access-status`, {
      headers,
    });
  },

  validateCode(slug: string, code: string, fingerprint: string) {
    return publicApiFetch<{
      valid: boolean;
      codeId: string;
      requestId: string | null;
      status: "pending" | "approved";
      pendingApproval: boolean;
      notifiedEmail?: string;
      emailSent?: boolean;
      portalToken?: string;
      permission?: string;
      canSign?: boolean;
      askTrustDevice?: boolean;
    }>(`${portalBase(slug)}/validate-code`, {
      method: "POST",
      body: JSON.stringify({ code, fingerprint }),
    });
  },

  requestAccess(slug: string, fingerprint: string) {
    return publicApiFetch<{
      valid: boolean;
      requestId: string | null;
      status: "pending" | "approved";
      pendingApproval: boolean;
      notifiedEmail?: string;
      emailSent?: boolean;
      portalToken?: string;
      permission?: string;
      canSign?: boolean;
    }>(`${portalBase(slug)}/request-access`, {
      method: "POST",
      body: JSON.stringify({ fingerprint }),
    });
  },

  getAccessRequestStatus(slug: string, requestId: string, fingerprint: string) {
    return portalApiFetch<{
      status: "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";
      requestId: string;
      authorized: boolean;
      portalToken?: string;
      pendingCodeUse?: boolean;
      authorizationCode?: string;
      permission?: string;
      canSign?: boolean;
    }>(`${portalBase(slug)}/access-request/${requestId}`, {
      headers: { "X-Device-Fingerprint": fingerprint },
    });
  },

  getAuthorizationPanel(token: string) {
    return publicApiFetch<import("@/modules/security/types").DeviceAuthorizationPanel>(
      `/contracts/portal/device-authorization/${token}`
    );
  },

  authorizeFromPanel(
    token: string,
    body: { permission: "VIEWER" | "SIGNER" }
  ) {
    return publicApiFetch<{
      status: "APPROVED" | "DENIED";
      requestId: string;
      permission?: string;
      permissionLabel?: string;
      message?: string;
    }>(`/contracts/portal/device-authorization/${token}/authorize`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  sign(
    slug: string,
    payload: {
      fingerprint: string;
      portalToken?: string;
      nome: string;
      documento: string;
      data?: string;
      hora?: string;
      aceiteEletronico: true;
    }
  ) {
    return portalApiFetch<{ signed: boolean; role: string; permission: string }>(
      `${portalBase(slug)}/sign`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: payload.portalToken
          ? { "X-Portal-Token": payload.portalToken, "X-Device-Fingerprint": payload.fingerprint }
          : { "X-Device-Fingerprint": payload.fingerprint },
      }
    );
  },

  completeAccess(slug: string, codeId: string, fingerprint: string, trustDevice: boolean) {
    return publicApiFetch<PortalSessionResult>(
      `${portalBase(slug)}/complete-access`,
      { method: "POST", body: JSON.stringify({ codeId, fingerprint, trustDevice }) }
    );
  },

  verifySession(slug: string, fingerprint: string, portalToken: string) {
    return publicApiFetch<{ valid: boolean }>(
      `${portalBase(slug)}/verify-session`,
      { method: "POST", body: JSON.stringify({ fingerprint, portalToken }) }
    );
  },

  getClientDevices(slug: string, fingerprint: string, portalToken: string) {
    return publicApiFetch<{ connectedCount: number; devices: ClientDevice[] }>(
      `${portalBase(slug)}/client-devices`,
      { method: "POST", body: JSON.stringify({ fingerprint, portalToken }) }
    );
  },

  requestDeviceCode(slug: string, fingerprint: string, portalToken: string) {
    return publicApiFetch<{ message: string; expiresAt: string; connectedDevices: number }>(
      `${portalBase(slug)}/request-device-code`,
      { method: "POST", body: JSON.stringify({ fingerprint, portalToken }) }
    );
  },
};

export const trustedDevicesApi = {
  list() {
    return apiFetch<TrustedDevice[]>("/security/trusted-devices");
  },

  register(fingerprint: string, label?: string) {
    return apiFetch<TrustedDevice>("/security/trusted-devices", {
      method: "POST",
      body: JSON.stringify({ fingerprint, label }),
    });
  },

  rename(id: string, label: string) {
    return apiFetch<{ id: string; label: string }>(`/security/trusted-devices/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ label }),
    });
  },

  revoke(id: string) {
    return apiFetch<{ success: boolean }>(`/security/trusted-devices/${id}/revoke`, {
      method: "POST",
    });
  },

  restore(id: string) {
    return apiFetch<{ success: boolean }>(`/security/trusted-devices/${id}/restore`, {
      method: "POST",
    });
  },

  remove(id: string) {
    return apiFetch<{ success: boolean }>(`/security/trusted-devices/${id}`, {
      method: "DELETE",
    });
  },

  check(fingerprint: string) {
    return apiFetch<{ trusted: boolean }>(
      `/security/trusted-devices/check?fingerprint=${encodeURIComponent(fingerprint)}`
    );
  },
};

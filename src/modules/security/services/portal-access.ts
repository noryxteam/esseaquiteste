import { portalApi } from "@/modules/security/api/security.api";
import { tokenStorage } from "@/modules/auth/storage/token.storage";
import {
  getDeviceFingerprint,
  getPortalToken,
  setPortalToken,
} from "@/modules/security/services/device-fingerprint";

function hasAdminPanelSession(): boolean {
  return Boolean(tokenStorage.getAccessToken() || tokenStorage.getRefreshToken());
}

/** Preview interno do painel — nunca usar no link enviado ao cliente. */
export function isStaffPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("preview") === "staff";
}

/**
 * Verifica acesso ao portal deste contrato (slug).
 * Autorização é sempre por contrato — não herda de outro cliente/contrato.
 * Staff só entra sem gate com ?preview=staff + sessão do painel.
 */
export async function resolvePortalAccess(slug: string): Promise<{
  authorized: boolean;
  trustedNoraxDevice?: boolean;
}> {
  const staffPreview = isStaffPreviewMode() && hasAdminPanelSession();
  const fp = getDeviceFingerprint();

  try {
    const res = await portalApi.getAccessStatus(slug, fp, { staffPreview });

    if (res.data.authorized) {
      const token = res.data.portalToken ?? getPortalToken(slug);
      if (token) {
        setPortalToken(slug, token);
        try {
          await portalApi.verifySession(slug, fp, token);
        } catch {
          // Sessão recém-criada — segue autorizado
        }
      }
      return {
        authorized: true,
        trustedNoraxDevice: res.data.trustedNoraxDevice,
      };
    }
  } catch {
    // Token de sessão só vale para ESTE slug
    const token = getPortalToken(slug);
    if (token) {
      try {
        await portalApi.verifySession(slug, fp, token);
        return { authorized: true };
      } catch {
        // sem acesso
      }
    }
  }

  return { authorized: false };
}

export { hasAdminPanelSession };

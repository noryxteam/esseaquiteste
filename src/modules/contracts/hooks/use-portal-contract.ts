"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthApiError } from "@/modules/auth/api/auth.api";
import type { ContractDocumentData } from "@/lib/mock-data/contract-document-types";
import { portalApi } from "@/modules/security/api/security.api";
import type { PortalContractMeta } from "@/modules/security/types";
import { resolvePortalAccess, hasAdminPanelSession } from "@/modules/security/services/portal-access";
import {
  getDeviceFingerprint,
  getPortalToken,
} from "@/modules/security/services/device-fingerprint";

export type PortalContractPhase =
  | "loading"
  | "not_found"
  | "needs_access"
  | "authorized";

export interface UsePortalContractResult {
  phase: PortalContractPhase;
  meta: PortalContractMeta | null;
  document: ContractDocumentData | null;
  error: string;
  reload: () => void;
  markAuthorized: () => void;
}

interface UsePortalContractOptions {
  /**
   * Só resolve existência + autorização (sem baixar o documento).
   * Usado na página /contract/[id] antes do redirect — evita carregar 2×.
   */
  skipDocument?: boolean;
}

/**
 * Carrega o contrato SEMPRE pelo ID/slug da URL via backend.
 * Autorização do dispositivo só ocorre depois que o contrato existe no banco.
 */
export function usePortalContract(
  slug: string,
  options: UsePortalContractOptions = {}
): UsePortalContractResult {
  const skipDocument = options.skipDocument === true;
  const [phase, setPhase] = useState<PortalContractPhase>("loading");
  const [meta, setMeta] = useState<PortalContractMeta | null>(null);
  const [document, setDocument] = useState<ContractDocumentData | null>(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const markAuthorized = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const started = performance.now();
      setPhase("loading");
      setError("");
      if (!skipDocument) setDocument(null);

      try {
        const t0 = performance.now();
        const resolved = await portalApi.resolve(slug);
        if (cancelled) return;
        setMeta(resolved.data);
        console.info(
          `[perf] portal.resolve ${slug} ${Math.round(performance.now() - t0)}ms`
        );

        const t1 = performance.now();
        const { authorized } = await resolvePortalAccess(slug);
        if (cancelled) return;
        console.info(
          `[perf] portal.access ${slug} ${Math.round(performance.now() - t1)}ms auth=${authorized}`
        );

        if (!authorized) {
          setPhase("needs_access");
          console.info(
            `[perf] portal.total ${slug} ${Math.round(performance.now() - started)}ms (gate)`
          );
          return;
        }

        if (skipDocument) {
          setPhase("authorized");
          console.info(
            `[perf] portal.total ${slug} ${Math.round(performance.now() - started)}ms (skipDocument)`
          );
          return;
        }

        const t2 = performance.now();
        const fp = getDeviceFingerprint();
        const token = getPortalToken(slug) ?? undefined;
        const staffPreview =
          typeof window !== "undefined" &&
          new URLSearchParams(window.location.search).get("preview") === "staff" &&
          hasAdminPanelSession();
        const doc = await portalApi.getDocument(slug, fp, token, { staffPreview });
        if (cancelled) return;
        setDocument(doc.data);
        setPhase("authorized");
        console.info(
          `[perf] portal.document ${slug} ${Math.round(performance.now() - t2)}ms | total ${Math.round(performance.now() - started)}ms`
        );
      } catch (e) {
        if (cancelled) return;
        if (e instanceof AuthApiError && e.status === 404) {
          setMeta(null);
          setPhase("not_found");
          return;
        }
        if (e instanceof AuthApiError && (e.status === 401 || e.code === "DEVICE_NOT_AUTHORIZED")) {
          setPhase("needs_access");
          return;
        }
        setError(e instanceof Error ? e.message : "Erro ao carregar contrato");
        setPhase("needs_access");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [slug, tick, skipDocument]);

  return { phase, meta, document, error, reload, markAuthorized };
}

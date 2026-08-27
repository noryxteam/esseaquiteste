"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { portalApi } from "@/modules/security/api/security.api";
import { usePortalContract } from "@/modules/contracts/hooks/use-portal-contract";
import { ContractDevice, type DeviceAccessPhase } from "@/components/contracts/ContractDevice";
import {
  getDeviceFingerprint,
  setPortalToken,
} from "@/modules/security/services/device-fingerprint";
import { FeedbackProvider } from "@/contexts/feedback-context";
import { ContractPortalLoading } from "@/components/contract-view/ContractPortalLoading";

const ContractViewer = dynamic(
  () =>
    import("@/components/contract-view/ContractViewer").then((m) => ({
      default: m.ContractViewer,
    })),
  {
    ssr: false,
    loading: () => <ContractPortalLoading label="Abrindo documento…" />,
  }
);

interface ContractPublicViewProps {
  slug: string;
}

export function ContractPublicView({ slug }: ContractPublicViewProps) {
  const { phase, meta, document, error: loadError, markAuthorized } = usePortalContract(slug);
  const [accessPhase, setAccessPhase] = useState<DeviceAccessPhase>("request");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [notifiedEmail, setNotifiedEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (!requestId || accessPhase !== "pending") return;

    const poll = async () => {
      try {
        const fp = getDeviceFingerprint();
        const res = await portalApi.getAccessRequestStatus(slug, requestId, fp);

        if (res.data.status === "APPROVED" && res.data.authorizationCode) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const validated = await portalApi.validateCode(slug, res.data.authorizationCode, fp);
          if (validated.data.portalToken) {
            setPortalToken(slug, validated.data.portalToken);
            setAccessPhase("approved");
            window.setTimeout(() => markAuthorized(), 1200);
          }
          return;
        }

        if (res.data.status === "APPROVED" && res.data.portalToken) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPortalToken(slug, res.data.portalToken);
          setAccessPhase("approved");
          window.setTimeout(() => markAuthorized(), 1200);
        } else if (res.data.status === "DENIED" || res.data.status === "EXPIRED") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setAccessPhase("denied");
        }
      } catch {
        // mantém polling
      }
    };

    void poll();
    pollingRef.current = setInterval(poll, 1500);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [requestId, accessPhase, slug, markAuthorized]);

  if (phase === "not_found") {
    notFound();
  }

  if (phase === "loading") {
    return <ContractPortalLoading label="Carregando contrato…" />;
  }

  const handleRequestAccess = async () => {
    setLoading(true);
    setError("");
    try {
      const fp = getDeviceFingerprint();
      const res = await portalApi.requestAccess(slug, fp);

      if (res.data.status === "approved" && res.data.portalToken) {
        setPortalToken(slug, res.data.portalToken);
        setAccessPhase("approved");
        window.setTimeout(() => markAuthorized(), 1200);
        return;
      }

      if (res.data.pendingApproval && res.data.requestId) {
        setRequestId(res.data.requestId);
        setNotifiedEmail(res.data.notifiedEmail ?? null);
        setEmailSent(res.data.emailSent ?? null);
        setAccessPhase("pending");
        return;
      }

      setError("Não foi possível solicitar autorização.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar o pedido.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  if (phase === "needs_access") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ContractDevice
          contractNumber={meta?.number ?? slug}
          onRequestAccess={handleRequestAccess}
          phase={accessPhase}
          notifiedEmail={notifiedEmail}
          emailSent={emailSent}
          error={error || loadError}
          loading={loading}
        />
      </div>
    );
  }

  if (!document) {
    return <ContractPortalLoading label="Abrindo documento…" />;
  }

  return (
    <FeedbackProvider>
      <ContractViewer data={document} />
    </FeedbackProvider>
  );
}

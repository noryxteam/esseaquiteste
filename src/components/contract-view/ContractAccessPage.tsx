"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { portalApi } from "@/modules/security/api/security.api";
import { usePortalContract } from "@/modules/contracts/hooks/use-portal-contract";
import {
  getDeviceFingerprint,
  setPortalToken,
} from "@/modules/security/services/device-fingerprint";
import { ContractDevice, type DeviceAccessPhase } from "@/components/contracts/ContractDevice";
import { ContractPortalLoading } from "@/components/contract-view/ContractPortalLoading";
import { getContractViewPath } from "@/lib/contract-routes";

interface ContractAccessPageProps {
  slug: string;
}

export function ContractAccessPage({ slug }: ContractAccessPageProps) {
  const router = useRouter();
  // Só meta + auth — o documento completo carrega em /visualizar (1×)
  const { phase, meta, error: loadError } = usePortalContract(slug, {
    skipDocument: true,
  });
  const [accessPhase, setAccessPhase] = useState<DeviceAccessPhase>("request");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [notifiedEmail, setNotifiedEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Prefetch da rota de visualização enquanto resolve auth (links antigos /contract/:id)
    router.prefetch(getContractViewPath(slug));
  }, [router, slug]);

  useEffect(() => {
    if (phase === "authorized") {
      router.replace(getContractViewPath(slug));
    }
  }, [phase, router, slug]);

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
            window.setTimeout(() => router.push(getContractViewPath(slug)), 1200);
          }
          return;
        }

        if (res.data.status === "APPROVED" && res.data.portalToken) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPortalToken(slug, res.data.portalToken);
          setAccessPhase("approved");
          window.setTimeout(() => router.push(getContractViewPath(slug)), 1200);
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
  }, [requestId, accessPhase, slug, router]);

  if (phase === "not_found") {
    notFound();
  }

  if (phase === "loading" || phase === "authorized" || !meta) {
    return (
      <ContractPortalLoading
        label={
          phase === "authorized"
            ? "Abrindo contrato…"
            : "Carregando contrato…"
        }
      />
    );
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
        window.setTimeout(() => router.push(getContractViewPath(slug)), 1200);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <ContractDevice
          contractNumber={meta.number}
          onRequestAccess={handleRequestAccess}
          phase={accessPhase}
          notifiedEmail={notifiedEmail}
          emailSent={emailSent}
          error={error || loadError}
          loading={loading}
        />
      </motion.div>
    </div>
  );
}

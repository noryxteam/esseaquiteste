"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ContractDevice, type DeviceAccessPhase } from "@/components/contracts/ContractDevice";
import { portalApi } from "@/modules/security/api/security.api";
import {
  getDeviceFingerprint,
  setPortalToken,
} from "@/modules/security/services/device-fingerprint";
import { resolvePortalAccess } from "@/modules/security/services/portal-access";
import { getAllElectronicContracts } from "@/mock/electronic-contracts/store";

interface FormDeviceGateProps {
  clientId: string;
  children: React.ReactNode;
}

/**
 * Gate de dispositivo no formulário público.
 * Usa o contrato âncora do cliente só para o fluxo de pedido de acesso —
 * autorização continua sendo por aquele slug, não libera outros contratos.
 */
export function FormDeviceGate({ clientId, children }: FormDeviceGateProps) {
  const [mounted, setMounted] = useState(false);
  const [anchorSlug, setAnchorSlug] = useState<string | null>(null);
  const [phase, setPhase] = useState<"loading" | "authorized" | "needs_access">("loading");
  const [accessPhase, setAccessPhase] = useState<DeviceAccessPhase>("request");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [notifiedEmail, setNotifiedEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contractNumber, setContractNumber] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const contracts = getAllElectronicContracts()
      .filter((c) => c.clienteId === clientId && Boolean(c.uniqueSlug))
      .sort((a, b) => {
        const ta = a.dataEnvio || a.dataCriacao || "";
        const tb = b.dataEnvio || b.dataCriacao || "";
        return ta < tb ? 1 : -1;
      });
    setAnchorSlug(contracts[0]?.uniqueSlug ?? null);
    setMounted(true);
  }, [clientId]);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    const run = async () => {
      setPhase("loading");
      setError("");

      // Não liberar formulário público só porque o painel está logado neste navegador
      if (!anchorSlug) {
        if (!cancelled) setPhase("authorized");
        return;
      }

      try {
        const resolved = await portalApi.resolve(anchorSlug);
        if (cancelled) return;
        setContractNumber(resolved.data.number ?? "");

        const { authorized } = await resolvePortalAccess(anchorSlug);
        if (cancelled) return;
        setPhase(authorized ? "authorized" : "needs_access");
      } catch {
        if (!cancelled) setPhase("needs_access");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [mounted, anchorSlug]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (!requestId || accessPhase !== "pending" || !anchorSlug) return;

    const poll = async () => {
      try {
        const fp = getDeviceFingerprint();
        const res = await portalApi.getAccessRequestStatus(anchorSlug, requestId, fp);

        if (res.data.status === "APPROVED" && res.data.authorizationCode) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const validated = await portalApi.validateCode(
            anchorSlug,
            res.data.authorizationCode,
            fp
          );
          if (validated.data.portalToken) {
            setPortalToken(anchorSlug, validated.data.portalToken);
            setAccessPhase("approved");
            window.setTimeout(() => setPhase("authorized"), 900);
          }
          return;
        }

        if (res.data.status === "APPROVED" && res.data.portalToken) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPortalToken(anchorSlug, res.data.portalToken);
          setAccessPhase("approved");
          window.setTimeout(() => setPhase("authorized"), 900);
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
  }, [requestId, accessPhase, anchorSlug]);

  const handleRequestAccess = async () => {
    if (!anchorSlug) {
      setError("Não há contrato do cliente para solicitar autorização.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fp = getDeviceFingerprint();
      const res = await portalApi.requestAccess(anchorSlug, fp);

      if (res.data.status === "approved" && res.data.portalToken) {
        setPortalToken(anchorSlug, res.data.portalToken);
        setAccessPhase("approved");
        window.setTimeout(() => setPhase("authorized"), 900);
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

  if (!mounted || phase === "loading") {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  if (phase === "authorized") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <ContractDevice
          contractNumber={contractNumber || undefined}
          onRequestAccess={handleRequestAccess}
          phase={accessPhase}
          notifiedEmail={notifiedEmail}
          emailSent={emailSent}
          error={error}
          loading={loading}
        />
      </motion.div>
    </div>
  );
}

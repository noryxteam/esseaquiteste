"use client";

import { useCallback, useEffect, useState } from "react";
import { securityApi } from "@/modules/security/api/security.api";
import type {
  AccessCode,
  AuthorizationHistoryEntry,
  AuthorizedDevice,
  ContractSecurityOverview,
  GeneratedAccessCode,
  PendingDeviceRequest,
  SecurityTimelineEvent,
} from "@/modules/security/types";

export function useContractSecurity(contractId: string) {
  const [overview, setOverview] = useState<ContractSecurityOverview | null>(null);
  const [devices, setDevices] = useState<AuthorizedDevice[]>([]);
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingDeviceRequest[]>([]);
  const [authHistory, setAuthHistory] = useState<AuthorizationHistoryEntry[]>([]);
  const [timeline, setTimeline] = useState<SecurityTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, dev, cd, tl, pending, history] = await Promise.all([
        securityApi.getOverview(contractId),
        securityApi.listDevices(contractId),
        securityApi.listCodes(contractId),
        securityApi.getTimeline(contractId),
        securityApi.listPendingRequests(contractId),
        securityApi.listAuthorizationHistory(contractId),
      ]);
      setOverview(ov.data);
      setDevices(dev.data);
      setCodes(cd.data);
      setTimeline(tl.data);
      setPendingRequests(pending.data);
      setAuthHistory(history.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar segurança");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const renameDevice = async (deviceId: string, label: string) => {
    await securityApi.renameDevice(contractId, deviceId, label);
    await refresh();
  };

  const revokeDevice = async (deviceId: string) => {
    await securityApi.revokeDevice(contractId, deviceId);
    await refresh();
  };

  const generateCode = async (
    validity: import("@/modules/security/types").CodeValidity,
    customMinutes?: number
  ): Promise<GeneratedAccessCode> => {
    const res = await securityApi.generateCode(contractId, validity, customMinutes);
    await refresh();
    return res.data;
  };

  const cancelCode = async (codeId: string) => {
    await securityApi.cancelCode(contractId, codeId);
    await refresh();
  };

  return {
    overview,
    devices,
    codes,
    pendingRequests,
    authHistory,
    timeline,
    loading,
    error,
    refresh,
    renameDevice,
    revokeDevice,
    generateCode,
    cancelCode,
  };
}

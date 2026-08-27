"use client";

import { useCallback, useEffect, useState } from "react";
import { trustedDevicesApi } from "@/modules/security/api/security.api";
import { getDeviceFingerprint } from "@/modules/security/services/device-fingerprint";
import type { TrustedDevice } from "@/modules/security/types";

export function useTrustedDevices() {
  const [devices, setDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTrusted, setCurrentTrusted] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, check] = await Promise.all([
        trustedDevicesApi.list(),
        trustedDevicesApi.check(getDeviceFingerprint()),
      ]);
      setDevices(list.data);
      setCurrentTrusted(check.data.trusted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar dispositivos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const registerCurrent = async (label?: string) => {
    await trustedDevicesApi.register(getDeviceFingerprint(), label);
    await refresh();
  };

  const rename = async (id: string, label: string) => {
    await trustedDevicesApi.rename(id, label);
    await refresh();
  };

  const revoke = async (id: string) => {
    await trustedDevicesApi.revoke(id);
    await refresh();
  };

  const restore = async (id: string) => {
    await trustedDevicesApi.restore(id);
    await refresh();
  };

  const remove = async (id: string) => {
    await trustedDevicesApi.remove(id);
    await refresh();
  };

  return {
    devices,
    loading,
    error,
    currentTrusted,
    refresh,
    registerCurrent,
    rename,
    revoke,
    restore,
    remove,
  };
}

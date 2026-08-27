"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import { buildDashboardData, buildRelatoriosData } from "@/lib/mock-data/adapters";
import type { DashboardData } from "@/lib/mock-data/types";
import type { RelatoriosData } from "@/lib/mock-data/relatorios-types";
import { integrationEventBus, registerIntegrationHandlers } from "@/modules/integration";
import { DomainEventType, type AffectedModule } from "@/modules/integration/types";
import { getUnreadNotifications } from "@/mock/notifications";
import { getRecentTimeline } from "@/mock/timeline";

interface AppState {
  version: number;
  dashboard: DashboardData;
  relatorios: RelatoriosData;
  unreadNotifications: number;
  recentTimelineCount: number;
}

interface AppContextValue extends AppState {
  refresh: (modules?: AffectedModule[]) => void;
  invalidate: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Cache por versão — revisitas não reconstruem dados já calculados */
const dataCache = new Map<number, Omit<AppState, "version">>();

function buildState(version: number): Omit<AppState, "version"> {
  const cached = dataCache.get(version);
  if (cached) return cached;

  const started = performance.now();
  const built = {
    dashboard: buildDashboardData(),
    relatorios: buildRelatoriosData("Período atual"),
    unreadNotifications: getUnreadNotifications().length,
    recentTimelineCount: getRecentTimeline(50).length,
  };
  const ms = Math.round(performance.now() - started);
  if (ms > 50) {
    console.info(`[perf] AppProvider.buildState v${version} ${ms}ms`);
  }

  dataCache.set(version, built);

  if (dataCache.size > 5) {
    const oldest = Math.min(...dataCache.keys());
    dataCache.delete(oldest);
  }

  return built;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);
  const handlersRegistered = useRef(false);

  const bumpVersion = useCallback(() => {
    startTransition(() => {
      setVersion((v) => v + 1);
    });
  }, []);

  const refresh = useCallback((_modules?: AffectedModule[]) => {
    bumpVersion();
  }, [bumpVersion]);

  const invalidate = useCallback(() => {
    bumpVersion();
  }, [bumpVersion]);

  useEffect(() => {
    if (!handlersRegistered.current) {
      registerIntegrationHandlers();
      handlersRegistered.current = true;
    }
    const unsub = integrationEventBus.on(DomainEventType.STATE_INVALIDATED, () => {
      bumpVersion();
    });
    return unsub;
  }, [bumpVersion]);

  const state = useMemo(() => {
    const built = buildState(version);
    return { ...built, version };
  }, [version]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      refresh,
      invalidate,
    }),
    [state, refresh, invalidate]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState deve ser usado dentro de AppProvider");
  }
  return ctx;
}

export function useAppStateOptional(): AppContextValue | null {
  return useContext(AppContext);
}

/** Selector estável — evita re-render quando só outros campos mudam */
export function useDashboardData(): DashboardData {
  const { dashboard } = useAppState();
  return dashboard;
}

export function useRelatoriosData(): RelatoriosData {
  const { relatorios } = useAppState();
  return relatorios;
}

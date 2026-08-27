"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/modules/auth/api";
import { AuthApiError } from "@/modules/auth/api/auth.api";
import { tokenStorage } from "@/modules/auth/storage/token.storage";
import type {
  AuthState,
  AuthUser,
  LoginCredentials,
  Permission,
  UserRole,
} from "@/modules/auth/types/auth.types";
import { hasPermission as checkPermission } from "@/modules/auth/utils/permissions";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Estado inicial idêntico no server e no client — evita hydration mismatch. */
const BOOT_STATE: AuthState = {
  status: "loading",
  user: null,
  isLoading: true,
  error: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(BOOT_STATE);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    const refresh = tokenStorage.getRefreshToken();

    if (!token && !refresh) {
      tokenStorage.clearAuthCookie();
      tokenStorage.clearCachedUser();
      setState({ status: "unauthenticated", user: null, isLoading: false, error: null });
      return;
    }

    try {
      const { data: user } = await authApi.me();
      if (user.status === "BLOCKED") {
        tokenStorage.clear();
        setState({ status: "blocked", user: null, isLoading: false, error: null });
        return;
      }
      tokenStorage.setAuthCookie();
      tokenStorage.setCachedUser(user);
      setState({ status: "authenticated", user, isLoading: false, error: null });
    } catch (error) {
      const cached = tokenStorage.getCachedUser<AuthUser>();
      if (cached && tokenStorage.hasSession()) {
        setState({ status: "authenticated", user: cached, isLoading: false, error: null });
        return;
      }

      tokenStorage.clear();
      if (error instanceof AuthApiError && error.code === "SESSION_EXPIRED") {
        setState({ status: "session_expired", user: null, isLoading: false, error: error.message });
      } else {
        setState({ status: "unauthenticated", user: null, isLoading: false, error: null });
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hasSession = tokenStorage.hasSession();
    const cached = tokenStorage.getCachedUser<AuthUser>();

    if (hasSession && cached) {
      setState({ status: "authenticated", user: cached, isLoading: false, error: null });
    } else if (!hasSession) {
      setState({ status: "unauthenticated", user: null, isLoading: false, error: null });
      return;
    }

    const hasCache = Boolean(cached);
    const safetyMs = hasCache ? 8_000 : 2_500;

    const safetyTimer = window.setTimeout(() => {
      if (cancelled) return;
      setState((prev) => {
        if (prev.status === "authenticated" && prev.user) {
          return { ...prev, isLoading: false };
        }
        const again = tokenStorage.getCachedUser<AuthUser>();
        if (again && tokenStorage.hasSession()) {
          return { status: "authenticated", user: again, isLoading: false, error: null };
        }
        tokenStorage.clear();
        return { status: "unauthenticated", user: null, isLoading: false, error: null };
      });
    }, safetyMs);

    void refreshUser().finally(() => {
      if (!cancelled) window.clearTimeout(safetyTimer);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimer);
    };
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      router.prefetch("/dashboard");

      try {
        const { data } = await authApi.login(credentials);
        tokenStorage.setTokens(data.accessToken, data.refreshToken, credentials.rememberMe ?? false);
        tokenStorage.setSessionId(data.sessionId, credentials.rememberMe ?? false);
        tokenStorage.setAuthCookie();

        if (data.user.status === "BLOCKED") {
          tokenStorage.clear();
          setState({ status: "blocked", user: null, isLoading: false, error: null });
          router.replace("/conta-bloqueada");
          return;
        }

        tokenStorage.setCachedUser(data.user, credentials.rememberMe ?? false);
        setState({ status: "authenticated", user: data.user, isLoading: false, error: null });
        router.replace("/dashboard");
      } catch (error) {
        const message =
          error instanceof AuthApiError ? error.message : "Não foi possível fazer login.";
        setState((s) => ({ ...s, isLoading: false, error: message }));
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(
    async (allDevices = false) => {
      const refreshToken = tokenStorage.getRefreshToken();
      try {
        if (refreshToken) {
          await authApi.logout(refreshToken, allDevices);
        }
      } catch {
        // limpa localmente mesmo se API falhar
      }
      tokenStorage.clear();
      setState({ status: "unauthenticated", user: null, isLoading: false, error: null });
      router.push("/login");
    },
    [router]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refreshUser,
      hasPermission: (permission: Permission) => checkPermission(state.user?.permissions, permission),
      hasRole: (...roles: UserRole[]) =>
        state.user ? roles.includes(state.user.role) : false,
    }),
    [state, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}

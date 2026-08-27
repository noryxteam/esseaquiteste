const ACCESS_KEY = "norax-access-token";
const REFRESH_KEY = "norax-refresh-token";
const SESSION_KEY = "norax-session-id";
const REMEMBER_KEY = "norax-remember-me";
const USER_CACHE_KEY = "norax-user-cache";

function getStorage(persistent: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  return persistent ? localStorage : sessionStorage;
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(ACCESS_KEY) ?? localStorage.getItem(ACCESS_KEY);
  },

  setAccessToken(token: string) {
    sessionStorage.setItem(ACCESS_KEY, token);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    const remember = localStorage.getItem(REMEMBER_KEY) === "true";
    const storage = getStorage(remember);
    return storage?.getItem(REFRESH_KEY) ?? null;
  },

  setTokens(accessToken: string, refreshToken: string, rememberMe: boolean) {
    sessionStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REMEMBER_KEY, String(rememberMe));
    const storage = getStorage(rememberMe);
    storage?.setItem(REFRESH_KEY, refreshToken);
    if (!rememberMe) {
      localStorage.removeItem(REFRESH_KEY);
    }
  },

  setSessionId(sessionId: string, rememberMe: boolean) {
    const storage = getStorage(rememberMe);
    storage?.setItem(SESSION_KEY, sessionId);
  },

  getSessionId(): string | null {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem(SESSION_KEY) ??
      localStorage.getItem(SESSION_KEY)
    );
  },

  getCachedUser<T>(): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw =
        sessionStorage.getItem(USER_CACHE_KEY) ?? localStorage.getItem(USER_CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setCachedUser(user: unknown, rememberMe?: boolean) {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify(user);
    sessionStorage.setItem(USER_CACHE_KEY, payload);
    const remember = rememberMe ?? localStorage.getItem(REMEMBER_KEY) === "true";
    if (remember) {
      localStorage.setItem(USER_CACHE_KEY, payload);
    }
  },

  clearCachedUser() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
  },

  clear() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    this.clearAuthCookie();
  },

  clearAuthCookie() {
    if (typeof window === "undefined") return;
    document.cookie = "norax-auth=; path=/; max-age=0";
  },

  setAuthCookie() {
    document.cookie = "norax-auth=1; path=/; max-age=2592000; SameSite=Lax";
  },

  hasSession(): boolean {
    return Boolean(this.getAccessToken() || this.getRefreshToken());
  },
};

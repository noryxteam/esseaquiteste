import { tokenStorage } from "@/modules/auth/storage/token.storage";

function normalizeApiUrl(url: string): string {
  return url.replace("://localhost", "://127.0.0.1");
}

const API_URL = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3333/api/v1"
);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

let refreshPromise: Promise<string | null> | null = null;

const DEFAULT_TIMEOUT_MS = 5_000;
const LOGIN_TIMEOUT_MS = 15_000;

async function parseResponseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AuthApiError(
        "Servidor indisponível. Execute npm run open-panel ou inicie o backend na porta 3333.",
        "NETWORK_TIMEOUT",
        0
      );
    }
    throw new AuthApiError("Não foi possível conectar ao servidor.", "NETWORK_ERROR", 0);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetchWithTimeout(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  const json = await parseResponseJson<ApiResponse<{ accessToken: string }>>(res);
  if (json?.success && json.data.accessToken) {
    tokenStorage.setAccessToken(json.data.accessToken);
    return json.data.accessToken;
  }
  return null;
}

function isAccessTokenExpired(token: string, skewMs = 30_000): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { exp?: number };
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000 - skewMs;
  } catch {
    return true;
  }
}

/** Garante JWT válido antes de rotas que usam auth opcional (ex.: portal de contratos). */
async function getValidAccessToken(): Promise<string | null> {
  let token = tokenStorage.getAccessToken();
  if (!token) return null;
  if (!isAccessTokenExpired(token)) return token;

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  const refreshed = await refreshPromise;
  return refreshed ?? tokenStorage.getAccessToken();
}

export async function publicApiFetch<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetchWithTimeout(`${API_URL}${path}`, { ...options, headers }, timeoutMs);
  const json = await parseResponseJson<ApiResponse<T> & { message?: string; error?: string }>(res);

  if (!json || !res.ok || !json.success) {
    throw new AuthApiError(
      json?.message ?? "Erro na requisição.",
      json?.error ?? "API_ERROR",
      res.status
    );
  }

  return json;
}

/** Portal público: envia JWT se o usuário estiver logado (dispositivos confiáveis Norax). */
export async function portalApiFetch<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retry = true
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = await getValidAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetchWithTimeout(`${API_URL}${path}`, { ...options, headers }, timeoutMs);

  if (res.status === 401 && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      return portalApiFetch<T>(path, options, timeoutMs, false);
    }
  }

  const json = await parseResponseJson<ApiResponse<T> & { message?: string; error?: string }>(res);

  if (!json || !res.ok || !json.success) {
    throw new AuthApiError(
      json?.message ?? "Erro na requisição.",
      json?.error ?? "API_ERROR",
      res.status
    );
  }

  return json;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retryOrTimeout: boolean | number = true,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<ApiResponse<T>> {
  const retry = typeof retryOrTimeout === "boolean" ? retryOrTimeout : true;
  const timeout = typeof retryOrTimeout === "number" ? retryOrTimeout : timeoutMs;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = tokenStorage.getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetchWithTimeout(`${API_URL}${path}`, { ...options, headers }, timeout);

  if (res.status === 401 && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) {
      return apiFetch<T>(path, options, false, timeout);
    }
    tokenStorage.clear();
    throw new AuthApiError("Sessão expirada.", "SESSION_EXPIRED", 401);
  }

  const json = await parseResponseJson<ApiResponse<T> & { message?: string; error?: string }>(res);

  if (!json || !res.ok || !json.success) {
    throw new AuthApiError(
      json?.message ?? "Erro na requisição.",
      json?.error ?? "API_ERROR",
      res.status
    );
  }

  return json;
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

export { API_URL };

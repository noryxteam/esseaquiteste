import { apiFetch, publicApiFetch } from "@/modules/auth/api/auth.api";
import type { AuthUser, LoginCredentials, LoginResponse } from "@/modules/auth/types/auth.types";

const LOGIN_TIMEOUT_MS = 15_000;

export const authApi = {
  login(credentials: LoginCredentials) {
    return publicApiFetch<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe ?? false,
        }),
      },
      LOGIN_TIMEOUT_MS
    );
  },
  me() {
    return apiFetch<AuthUser>("/auth/me", {}, true, 2_500);
  },

  logout(refreshToken: string, allDevices = false) {
    return apiFetch<null>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken, allDevices }),
    });
  },

  forgotPassword(email: string) {
    return publicApiFetch<{ message: string; mockResetToken?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(token: string, password: string) {
    return publicApiFetch<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  changePassword(currentPassword: string, newPassword: string) {
    return apiFetch<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

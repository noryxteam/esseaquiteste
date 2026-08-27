"use client";

import Link from "next/link";
import { useState } from "react";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Input } from "@/components/inputs/Input";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import { AuthApiError } from "@/modules/auth/api/auth.api";
import { useAuth } from "@/contexts/auth-context";

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login({ email, password, rememberMe });
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.code === "ACCOUNT_BLOCKED") {
          window.location.href = "/conta-bloqueada";
          return;
        }
        setLocalError(err.message);
      }
    }
  }

  const displayError = localError ?? error;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        required
      />
      <PasswordInput
        label="Senha"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-border-subtle bg-surface-inset"
          />
          Lembrar dispositivo
        </label>
        <Link href="/esqueci-senha" className="text-foreground hover:underline">
          Esqueci minha senha
        </Link>
      </div>

      {displayError && (
        <p className="text-sm text-state-red text-center">{displayError}</p>
      )}

      <PrimaryButton type="submit" className="w-full" disabled={isLoading || undefined}>
        {isLoading ? "Entrando..." : "Entrar"}
      </PrimaryButton>
    </form>
  );
}

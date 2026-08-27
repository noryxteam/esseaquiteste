"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import { authApi } from "@/modules/auth/api";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PublicRoute } from "@/modules/auth/guards/PublicRoute";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!token) {
      setError("Token inválido.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch {
      setError("Token inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-state-red">Link inválido ou expirado.</p>
        <Link href="/esqueci-senha" className="text-sm hover:underline">
          Solicitar novo link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">Senha redefinida com sucesso.</p>
        <Link href="/login">
          <PrimaryButton className="w-full">Ir para login</PrimaryButton>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PasswordInput
        label="Nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />
      <PasswordInput
        label="Confirmar senha"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        minLength={8}
        required
      />
      {error && <p className="text-sm text-state-red text-center">{error}</p>}
      <PrimaryButton type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : "Redefinir senha"}
      </PrimaryButton>
    </form>
  );
}

export default function NewPasswordPage() {
  return (
    <PublicRoute>
      <AuthLayout title="Nova senha" subtitle="Crie uma senha segura para sua conta">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </AuthLayout>
    </PublicRoute>
  );
}

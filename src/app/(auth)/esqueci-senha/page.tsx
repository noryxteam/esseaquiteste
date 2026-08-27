"use client";

import Link from "next/link";
import { useState } from "react";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Input } from "@/components/inputs/Input";
import { authApi } from "@/modules/auth/api";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { PublicRoute } from "@/modules/auth/guards/PublicRoute";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mockToken, setMockToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword(email);
      setSent(true);
      if (data.mockResetToken) setMockToken(data.mockResetToken);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicRoute>
      <AuthLayout
        title="Recuperar senha"
        subtitle="Enviaremos instruções para o seu e-mail"
      >
        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.
            </p>
            {mockToken && (
              <p className="text-xs text-muted-foreground break-all">
                Dev:{" "}
                <Link href={`/nova-senha?token=${mockToken}`} className="underline">
                  redefinir senha
                </Link>
              </p>
            )}
            <Link href="/login" className="text-sm text-foreground hover:underline">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link"}
            </PrimaryButton>
            <Link href="/login" className="block text-center text-sm text-muted-foreground hover:underline">
              Voltar ao login
            </Link>
          </form>
        )}
      </AuthLayout>
    </PublicRoute>
  );
}

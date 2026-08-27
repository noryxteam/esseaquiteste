"use client";

import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { LoginPrefetch } from "@/modules/auth/components/LoginPrefetch";
import { PublicRoute } from "@/modules/auth/guards/PublicRoute";

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginPrefetch />
      <AuthLayout title="Entrar" subtitle="Acesse o painel Norax">
        <LoginForm />
      </AuthLayout>
    </PublicRoute>
  );
}

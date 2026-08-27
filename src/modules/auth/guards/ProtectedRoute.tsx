"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { PageLoader } from "@/components/loaders/PageLoader";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (status === "unauthenticated") router.replace("/login");
    if (status === "session_expired") router.replace("/sessao-expirada");
    if (status === "blocked") router.replace("/conta-bloqueada");
  }, [status, isLoading, router]);

  if (isLoading || status === "loading") return <PageLoader variant="spinner" />;
  if (status !== "authenticated") return null;

  return <>{children}</>;
}

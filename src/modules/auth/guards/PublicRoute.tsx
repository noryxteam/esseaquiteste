"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { PageLoader } from "@/components/loaders/PageLoader";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = "/dashboard" }: PublicRouteProps) {
  const { status, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoading && status === "authenticated") {
      router.replace(redirectTo);
    }
  }, [mounted, status, isLoading, router, redirectTo]);

  // Evita mismatch: no SSR e no 1º paint mostra o formulário de forma estável
  if (!mounted) {
    return <>{children}</>;
  }

  if (isLoading) return <PageLoader variant="spinner" />;
  if (status === "authenticated") return <PageLoader variant="spinner" />;

  return <>{children}</>;
}
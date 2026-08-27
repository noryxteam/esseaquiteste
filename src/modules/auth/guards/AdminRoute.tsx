"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isAdmin } from "@/modules/auth/utils/permissions";
import { PageLoader } from "@/components/loaders/PageLoader";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, status, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (status !== "authenticated") {
      router.replace("/login");
      return;
    }
    if (!isAdmin(user?.role)) {
      router.replace("/acesso-negado");
    }
  }, [status, isLoading, user, router]);

  if (isLoading || status !== "authenticated") return <PageLoader />;
  if (!isAdmin(user?.role)) return <PageLoader />;

  return <>{children}</>;
}

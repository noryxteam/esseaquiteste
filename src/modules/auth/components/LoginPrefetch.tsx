"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Pré-carrega o dashboard para transição rápida após login. */
export function LoginPrefetch() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard");
    void import("@/components/dashboard/DashboardHome");
  }, [router]);

  return null;
}

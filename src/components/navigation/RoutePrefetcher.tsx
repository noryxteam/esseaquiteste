"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { navigation } from "@/lib/navigation";

/**
 * Prefetch escalonado das rotas do menu — quando o usuário clica,
 * a página já está compilada/pronta (sem delay de 7–10s).
 */
export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const routes = navigation.map((item) => item.href);
    let index = 0;

    const tick = () => {
      if (index >= routes.length) return;
      router.prefetch(routes[index]);
      index += 1;
      if (index < routes.length) {
        timer = window.setTimeout(tick, 350);
      }
    };

    let timer = window.setTimeout(tick, 300);
    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}

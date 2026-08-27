"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { BreadcrumbItem } from "@/components/navigation/Breadcrumb";
import { routes } from "@/lib/app-routes";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Visão Geral",
  clientes: "Clientes",
  projetos: "Projetos",
  reunioes: "Reuniões",
  contratos: "Contratos",
  financeiro: "Financeiro",
  briefings: "Briefings",
  tasks: "Tasks",
  equipe: "Equipe",
  arquivos: "Arquivos",
  modelos: "Modelos",
  propostas: "Propostas",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
  integracoes: "Integrações",
  novo: "Novo",
  editar: "Editar",
  seguranca: "Segurança",
  "ai-engine": "AI Engine",
};

export function useBreadcrumb(extra?: BreadcrumbItem[]): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = segments.map((seg, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/");
      const isId = seg.match(/^(cli|prj|ctr|tsk|brf|prop|usr|arq|mdl)-/);
      const label = isId ? seg.toUpperCase() : (SEGMENT_LABELS[seg] ?? seg);
      const isLast = i === segments.length - 1 && !extra?.length;
      return { label, href: isLast ? undefined : href };
    });

    if (extra?.length) {
      return [...items.slice(0, -1), ...items.slice(-1), ...extra];
    }
    return items;
  }, [pathname, extra]);
}

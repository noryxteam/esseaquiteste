import type { ComponentType } from "react";
import {
  ClientesSkeleton,
  ContratosSkeleton,
  FinanceiroSkeleton,
  GenericPageSkeleton,
  ProjetosSkeleton,
  RelatoriosSkeleton,
  ReunioesSkeleton,
} from "@/components/loaders/skeletons";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

const ROUTE_SKELETONS: Record<string, ComponentType> = {
  "/dashboard": DashboardSkeleton,
  "/clientes": ClientesSkeleton,
  "/projetos": ProjetosSkeleton,
  "/reunioes": ReunioesSkeleton,
  "/contratos": ContratosSkeleton,
  "/financeiro": FinanceiroSkeleton,
  "/relatorios": RelatoriosSkeleton,
};

export function getSkeletonForPath(pathname: string): ComponentType {
  if (ROUTE_SKELETONS[pathname]) return ROUTE_SKELETONS[pathname];

  const prefix = Object.keys(ROUTE_SKELETONS).find(
    (route) => route !== "/dashboard" && pathname.startsWith(`${route}/`)
  );
  if (prefix) return ROUTE_SKELETONS[prefix];

  return GenericPageSkeleton;
}

/** Todas as rotas do menu — prefetch no hover e em idle */
export const PREFETCH_ROUTES = [
  "/dashboard",
  "/clientes",
  "/projetos",
  "/reunioes",
  "/contratos",
  "/financeiro",
  "/propostas",
  "/briefings",
  "/tasks",
  "/equipe",
  "/arquivos",
  "/modelos",
  "/relatorios",
  "/configuracoes",
  "/integracoes",
] as const;

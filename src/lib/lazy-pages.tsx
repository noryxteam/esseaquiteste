"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ClientesSkeleton } from "@/components/loaders/skeletons/ClientesSkeleton";
import { ContratosSkeleton } from "@/components/loaders/skeletons/ContratosSkeleton";
import { FinanceiroSkeleton } from "@/components/loaders/skeletons/FinanceiroSkeleton";
import { ProjetosSkeleton } from "@/components/loaders/skeletons/ProjetosSkeleton";
import { RelatoriosSkeleton } from "@/components/loaders/skeletons/RelatoriosSkeleton";
import { ReunioesSkeleton } from "@/components/loaders/skeletons/ReunioesSkeleton";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { GenericPageSkeleton } from "@/components/loaders/skeletons/GenericPageSkeleton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyPage(loader: () => Promise<{ default: ComponentType<any> }>, Skeleton: ComponentType) {
  return dynamic(loader, { loading: () => <Skeleton /> });
}

export const LazyDashboardHome = lazyPage(
  () => import("@/components/dashboard/DashboardHome").then((m) => ({ default: m.DashboardHome })),
  DashboardSkeleton
);

export const LazyClientesHome = lazyPage(
  () => import("@/components/clientes/ClientesHome").then((m) => ({ default: m.ClientesHome })),
  ClientesSkeleton
);

export const LazyClientDetailPage = lazyPage(
  () => import("@/components/clientes/ClientDetailPage").then((m) => ({ default: m.ClientDetailPage })),
  ClientesSkeleton
);

export const LazyProjetosHome = lazyPage(
  () => import("@/components/projetos/ProjetosHome").then((m) => ({ default: m.ProjetosHome })),
  ProjetosSkeleton
);

export const LazyProjectDetailPage = lazyPage(
  () => import("@/components/projetos/ProjectDetailPage").then((m) => ({ default: m.ProjectDetailPage })),
  ProjetosSkeleton
);

export const LazyReunioesHome = lazyPage(
  () => import("@/components/reunioes/ReunioesHome").then((m) => ({ default: m.ReunioesHome })),
  ReunioesSkeleton
);

export const LazyContratosHome = lazyPage(
  () => import("@/components/contratos/ContratosHome").then((m) => ({ default: m.ContratosHome })),
  ContratosSkeleton
);

export const LazyFinanceiroHome = lazyPage(
  () => import("@/components/financeiro/FinanceiroHome").then((m) => ({ default: m.FinanceiroHome })),
  FinanceiroSkeleton
);

export const LazyRelatoriosHome = lazyPage(
  () => import("@/components/relatorios/RelatoriosHome").then((m) => ({ default: m.RelatoriosHome })),
  RelatoriosSkeleton
);

export const LazyContractNewPage = lazyPage(
  () => import("@/components/contracts/ContractNewPage").then((m) => ({ default: m.ContractNewPage })),
  ContratosSkeleton
);

export const LazyContractDetailPage = lazyPage(
  () => import("@/components/contracts/ContractDetailPage").then((m) => ({ default: m.ContractDetailPage })),
  ContratosSkeleton
);

export const LazyContractEditPage = lazyPage(
  () => import("@/components/contracts/ContractEditPage").then((m) => ({ default: m.ContractEditPage })),
  ContratosSkeleton
);

export const LazyMeetingIntelligenceHome = lazyPage(
  () =>
    import("@/components/meeting-intelligence/MeetingIntelligenceHome").then((m) => ({
      default: m.MeetingIntelligenceHome,
    })),
  GenericPageSkeleton
);

export const LazyMeetingAIEnginePage = lazyPage(
  () =>
    import("@/modules/meeting-ai/pages/MeetingAIEnginePage").then((m) => ({
      default: m.MeetingAIEnginePage,
    })),
  GenericPageSkeleton
);

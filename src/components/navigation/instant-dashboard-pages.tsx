"use client";

import type { ComponentType } from "react";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { ClientesHome } from "@/components/clientes/ClientesHome";
import { ProjetosHome } from "@/components/projetos/ProjetosHome";
import { ReunioesHome } from "@/components/reunioes/ReunioesHome";
import { PropostasPage } from "@/components/propostas/PropostasPage";
import { ContratosHome } from "@/components/contratos/ContratosHome";
import { FinanceiroHome } from "@/components/financeiro/FinanceiroHome";
import { BriefingsPage } from "@/components/briefings/BriefingsPage";
import { TasksPage } from "@/components/tasks/TasksPage";
import { EquipePage } from "@/components/equipe/EquipePage";
import { ArquivosPage } from "@/components/arquivos/ArquivosPage";
import { ModelosPage } from "@/components/modelos/ModelosPage";
import { RelatoriosHome } from "@/components/relatorios/RelatoriosHome";
import { IntegracoesPage } from "@/components/integracoes/IntegracoesPage";
import { ApagaLogoPage } from "@/components/apaga-logo/ApagaLogoPage";
import ConfiguracoesPage from "@/app/(dashboard)/configuracoes/page";

/**
 * Páginas do menu renderizadas no client na hora do clique —
 * não espera o Next.js compilar a rota (fim do lag de 10s).
 */
export const INSTANT_DASHBOARD_PAGES: Record<string, ComponentType> = {
  "/dashboard": DashboardHome,
  "/clientes": ClientesHome,
  "/projetos": ProjetosHome,
  "/reunioes": ReunioesHome,
  "/propostas": PropostasPage,
  "/contratos": ContratosHome,
  "/apaga-logo": ApagaLogoPage,
  "/financeiro": FinanceiroHome,
  "/briefings": BriefingsPage,
  "/tasks": TasksPage,
  "/equipe": EquipePage,
  "/arquivos": ArquivosPage,
  "/modelos": ModelosPage,
  "/relatorios": RelatoriosHome,
  "/configuracoes": ConfiguracoesPage,
  "/integracoes": IntegracoesPage,
};

export function getInstantDashboardPage(href: string): ComponentType | null {
  return INSTANT_DASHBOARD_PAGES[href] ?? null;
}

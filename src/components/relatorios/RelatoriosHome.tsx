"use client";

import { startTransition, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Search } from "lucide-react";
import { getRelatoriosData } from "@/lib/mock-data/relatorios";
import type { ProjectPerformance, RecentActivityItem, ReportPeriod, ReportStat, ReportTab, TopClient } from "@/lib/mock-data/relatorios-types";
import { useAppState } from "@/contexts/app-context";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";
import { ReportsHeader } from "@/components/relatorios/ReportsHeader";
import { PeriodSelector } from "@/components/relatorios/PeriodSelector";
import { ReportsTabs } from "@/components/relatorios/ReportsTabs";
import { StatsCard } from "@/components/relatorios/StatsCard";
import { RevenueChart } from "@/components/relatorios/RevenueChart";
import { RevenueComparison } from "@/components/relatorios/RevenueComparison";
import { RevenueDistribution } from "@/components/relatorios/RevenueDistribution";
import { ProjectsPerformanceTable } from "@/components/relatorios/ProjectsPerformanceTable";
import { SalesFunnel } from "@/components/relatorios/SalesFunnel";
import { ProductivityMetrics } from "@/components/relatorios/ProductivityMetrics";
import { TopClients } from "@/components/relatorios/TopClients";
import { RecentActivity } from "@/components/relatorios/RecentActivity";
import { Button } from "@/components/ui/button-shadcn";
import { Input } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";

const OTHER_TABS: ReportTab[] = [
  "financeiro",
  "projetos",
  "clientes",
  "contratos",
  "produtividade",
  "equipe",
  "desempenho",
];

function VisaoGeralContent({
  stats,
  data,
  onProjectClick,
  onClientClick,
  onActivityClick,
}: {
  stats: ReportStat[];
  data: ReturnType<typeof getRelatoriosData>;
  onProjectClick: (project: ProjectPerformance) => void;
  onClientClick: (client: TopClient) => void;
  onActivityClick: (item: RecentActivityItem) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <RevenueChart data={data.revenueOverTime} />
        </div>
        <div className="lg:col-span-4">
          <RevenueComparison data={data.revenueComparison} />
        </div>
        <div className="lg:col-span-3">
          <RevenueDistribution segments={data.revenueDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <ProjectsPerformanceTable projects={data.projectsPerformance} onProjectClick={onProjectClick} />
        </div>
        <div className="lg:col-span-3">
          <SalesFunnel stages={data.salesFunnel} />
        </div>
        <div className="lg:col-span-3">
          <ProductivityMetrics metrics={data.productivityMetrics} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8">
          <RecentActivity items={data.recentActivity} onItemClick={onActivityClick} />
        </div>
        <div className="xl:col-span-4">
          <TopClients clients={data.topClients} onClientClick={onClientClick} />
        </div>
      </div>
    </>
  );
}

function TabContent({
  tab,
  data,
  stats,
  onProjectClick,
  onClientClick,
  onActivityClick,
}: {
  tab: ReportTab;
  data: ReturnType<typeof getRelatoriosData>;
  stats: ReportStat[];
  onProjectClick: (project: ProjectPerformance) => void;
  onClientClick: (client: TopClient) => void;
  onActivityClick: (item: RecentActivityItem) => void;
}) {
  switch (tab) {
    case "financeiro":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.slice(0, 3).map((stat) => (
              <StatsCard key={stat.id} {...stat} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5"><RevenueChart data={data.revenueOverTime} /></div>
            <div className="lg:col-span-4"><RevenueComparison data={data.revenueComparison} /></div>
            <div className="lg:col-span-3"><RevenueDistribution segments={data.revenueDistribution} /></div>
          </div>
        </div>
      );
    case "projetos":
      return (
        <div className="space-y-4">
          <ProjectsPerformanceTable projects={data.projectsPerformance} onProjectClick={onProjectClick} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SalesFunnel stages={data.salesFunnel} />
            <ProductivityMetrics metrics={data.productivityMetrics} />
          </div>
        </div>
      );
    case "clientes":
      return (
        <div className="space-y-4">
          <TopClients clients={data.topClients} onClientClick={onClientClick} />
          <RecentActivity items={data.recentActivity} onItemClick={onActivityClick} />
        </div>
      );
    case "contratos":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SalesFunnel stages={data.salesFunnel} />
            <RevenueDistribution segments={data.revenueDistribution} />
          </div>
          <RecentActivity items={data.recentActivity} onItemClick={onActivityClick} />
        </div>
      );
    case "produtividade":
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProductivityMetrics metrics={data.productivityMetrics} />
          <RevenueChart data={data.revenueOverTime} />
        </div>
      );
    case "equipe":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.slice(0, 4).map((stat) => (
              <StatsCard key={stat.id} {...stat} />
            ))}
          </div>
          <ProductivityMetrics metrics={data.productivityMetrics} />
        </div>
      );
    case "desempenho":
      return (
        <div className="space-y-4">
          <ProjectsPerformanceTable projects={data.projectsPerformance} onProjectClick={onProjectClick} />
          <RevenueChart data={data.revenueOverTime} />
        </div>
      );
    default:
      return null;
  }
}

export function RelatoriosHome() {
  const router = useRouter();
  const { showSuccess, showInfo } = useFeedback();
  const [period, setPeriod] = useState<ReportPeriod>("maio-2024");
  const [activeTab, setActiveTab] = useState<ReportTab>("visao-geral");
  const [searchQuery, setSearchQuery] = useState("");
  const { version } = useAppState();

  const data = useMemo(() => getRelatoriosData(period), [period, version]);

  const filteredStats = useMemo(() => {
    if (!searchQuery.trim()) return data.stats;
    const q = searchQuery.toLowerCase();
    return data.stats.filter((s) => s.title.toLowerCase().includes(q));
  }, [data.stats, searchQuery]);

  const handleTabChange = (tab: ReportTab) => {
    startTransition(() => setActiveTab(tab));
  };

  const handleExport = () => {
    showSuccess(`Relatório de ${activeTab.replace("-", " ")} exportado com sucesso`);
  };

  const onProjectClick = useCallback(
    (project: ProjectPerformance) => router.push(routes.projeto(project.id)),
    [router]
  );

  const onClientClick = useCallback(
    (client: TopClient) => router.push(routes.cliente(client.id)),
    [router]
  );

  const onActivityClick = useCallback(
    (item: RecentActivityItem) => showInfo(`${item.title}: ${item.description}`),
    [showInfo]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <ReportsHeader />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <PeriodSelector value={period} onChange={setPeriod} />
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs border-border-subtle text-muted-foreground hover:text-foreground bg-surface/40"
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5" />
            Exportar relatório
          </Button>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar relatórios, métricas ou dados..."
          className="pl-9 h-10 bg-surface-inset border-border-subtle"
        />
      </div>

      <ReportsTabs active={activeTab} onChange={handleTabChange} />

      <div className={cn("space-y-5", activeTab !== "visao-geral" && "hidden")} aria-hidden={activeTab !== "visao-geral"}>
        <VisaoGeralContent
          stats={filteredStats}
          data={data}
          onProjectClick={onProjectClick}
          onClientClick={onClientClick}
          onActivityClick={onActivityClick}
        />
      </div>

      {OTHER_TABS.map((tab) => (
        <div key={tab} className={cn("space-y-5", activeTab !== tab && "hidden")} aria-hidden={activeTab !== tab}>
          <TabContent
            tab={tab}
            data={data}
            stats={filteredStats}
            onProjectClick={onProjectClick}
            onClientClick={onClientClick}
            onActivityClick={onActivityClick}
          />
        </div>
      ))}
    </div>
  );
}

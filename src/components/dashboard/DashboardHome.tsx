"use client";

import dynamic from "next/dynamic";
import { memo } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { AgendaWidget } from "@/components/dashboard/AgendaWidget";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { NotesWidget } from "@/components/dashboard/NotesWidget";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { BottomMetrics } from "@/components/dashboard/BottomMetrics";
import { ChartSkeleton } from "@/components/loaders/skeletons/ChartSkeleton";
import { useDashboardData } from "@/contexts/app-context";
import { KPI_ROUTES } from "@/lib/app-routes";

const RevenueChart = dynamic(
  () => import("@/components/dashboard/RevenueChart").then((m) => ({ default: m.RevenueChart })),
  { loading: () => <ChartSkeleton /> }
);

const ProjectsChart = dynamic(
  () => import("@/components/dashboard/ProjectsChart").then((m) => ({ default: m.ProjectsChart })),
  { loading: () => <ChartSkeleton /> }
);

function DashboardHomeInner() {
  const data = useDashboardData();

  return (
    <div className="space-y-6">
      <DashboardHeader userName={data.user.name} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {data.kpis.map((kpi, i) => (
          <DashboardStatCard key={kpi.id} {...kpi} index={i} href={KPI_ROUTES[kpi.id]} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="min-h-[280px]">
          <RevenueChart
            data={data.revenue.data}
            total={data.revenue.total}
            trend={data.revenue.trend}
            trendDirection={data.revenue.trendDirection}
            period={data.revenue.period}
          />
        </div>
        <div className="min-h-[280px]">
          <ProjectsChart
            data={data.projectsChart.data}
            total={data.projectsChart.total}
            trend={data.projectsChart.trend}
            trendDirection={data.projectsChart.trendDirection}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AgendaWidget items={data.agenda} />
        <TasksWidget items={data.tasks} />
        <NotesWidget items={data.notes} />
      </div>

      <ProjectsTable projects={data.projects} />

      <BottomMetrics metrics={data.bottomMetrics} />
    </div>
  );
}

export const DashboardHome = memo(DashboardHomeInner);

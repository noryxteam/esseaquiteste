"use client";

import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import type { ProjectRow } from "@/lib/mock-data/types";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { routes } from "@/lib/app-routes";

interface ProjectsTableProps {
  projects: ProjectRow[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();

  const navigate = (id: string) => router.push(routes.projeto(id));

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden hover:border-border-strong transition-colors">
      <div className="px-4 sm:px-5 py-4 border-b border-border-subtle">
        <p className="text-sm font-medium text-foreground">Projetos em andamento</p>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3 text-xs font-medium text-foreground/40">Projeto</th>
              <th className="px-5 py-3 text-xs font-medium text-foreground/40">Cliente</th>
              <th className="px-5 py-3 text-xs font-medium text-foreground/40">Etapa atual</th>
              <th className="px-5 py-3 text-xs font-medium text-foreground/40 w-[180px]">Progresso</th>
              <th className="px-5 py-3 text-xs font-medium text-foreground/40">Entrega prevista</th>
              <th className="px-5 py-3 text-xs font-medium text-foreground/40">Responsável</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => navigate(project.id)}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-surface-elevated border border-border-subtle flex items-center justify-center shrink-0">
                      <FolderKanban className="h-3.5 w-3.5 text-foreground/40" />
                    </div>
                    <span className="font-medium text-foreground">{project.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-foreground/50">{project.client}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    {project.stage}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <ProgressBar value={project.progress} showLabel />
                </td>
                <td className="px-5 py-3.5 text-foreground/50 tabular-nums">{project.dueDate}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-medium text-foreground/70">
                      {project.assignee.initials}
                    </div>
                    <span className="text-foreground/50 text-xs hidden xl:inline">{project.assignee.name}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-border-subtle">
        {projects.map((project) => (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(project.id)}
            onKeyDown={(e) => e.key === "Enter" && navigate(project.id)}
            className="p-4 space-y-3 cursor-pointer hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-7 w-7 rounded-md bg-surface-elevated border border-border-subtle flex items-center justify-center shrink-0">
                  <FolderKanban className="h-3.5 w-3.5 text-foreground/40" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{project.name}</p>
                  <p className="text-xs text-foreground/50">{project.client}</p>
                </div>
              </div>
              <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-medium text-foreground/70 shrink-0">
                {project.assignee.initials}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                {project.stage}
              </span>
              <span className="text-foreground/50 tabular-nums">{project.dueDate}</span>
            </div>
            <ProgressBar value={project.progress} showLabel />
          </div>
        ))}
      </div>
    </div>
  );
}

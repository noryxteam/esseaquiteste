"use client";

import { FolderKanban } from "lucide-react";
import type { ProjectPerformance } from "@/lib/mock-data/relatorios-types";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";

interface ProjectsPerformanceTableProps {
  projects: ProjectPerformance[];
  onProjectClick?: (project: ProjectPerformance) => void;
}

export function ProjectsPerformanceTable({ projects, onProjectClick }: ProjectsPerformanceTableProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 overflow-hidden h-full flex flex-col">
      <div className="px-4 sm:px-5 py-4 border-b border-border-subtle">
        <h2 className="text-sm font-medium text-foreground">Desempenho por projeto</h2>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border-subtle text-left bg-surface/40">
              <th className="px-4 py-2.5 text-[10px] font-medium text-muted-foreground">Projeto</th>
              <th className="px-4 py-2.5 text-[10px] font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-2.5 text-[10px] font-medium text-muted-foreground">Faturamento</th>
              <th className="px-4 py-2.5 text-[10px] font-medium text-muted-foreground">Custo</th>
              <th className="px-4 py-2.5 text-[10px] font-medium text-muted-foreground">Lucro</th>
              <th className="px-4 py-2.5 text-[10px] font-medium text-muted-foreground">Margem</th>
              <th className="px-4 py-2.5 text-[10px] font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => onProjectClick?.(project)}
                className={cn(
                  "border-b border-border-subtle last:border-0 hover:bg-surface-hover/40 transition-colors",
                  onProjectClick && "cursor-pointer"
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                      <FolderKanban className="h-3.5 w-3.5 text-foreground/70" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{project.projeto}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{project.projetoId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{project.cliente}</td>
                <td className="px-4 py-3 text-xs tabular-nums text-foreground">{project.faturamento}</td>
                <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground">{project.custo}</td>
                <td className="px-4 py-3 text-xs tabular-nums text-foreground">{project.lucro}</td>
                <td className="px-4 py-3 min-w-[80px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-surface-inset overflow-hidden">
                      <div
                        className="h-full rounded-full bg-foreground/80"
                        style={{ width: `${project.margem}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums w-7">{project.margem}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        project.status === "concluido" && "bg-foreground",
                        project.status === "em-andamento" && "bg-foreground/50",
                        project.status === "planejamento" && "bg-foreground/25"
                      )}
                    />
                    {project.statusLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-border-subtle">
        <Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground hover:text-foreground px-0">
          Ver todos os projetos →
        </Button>
      </div>
    </div>
  );
}

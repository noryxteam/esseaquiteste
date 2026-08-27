"use client";

import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import type { Project } from "@/lib/mock-data/projetos-types";
import { ProjectProgress } from "@/components/projetos/ProjectProgress";
import { ProjectAvatarGroup } from "@/components/projetos/ProjectAvatarGroup";
import { ActionMenu } from "@/components/ui/action-menu";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/app-routes";
import { useFeedback } from "@/contexts/feedback-context";
import { useInstantNav } from "@/contexts/instant-nav-context";

const STAGE_DOT: Record<string, string> = {
  desenvolvimento: "bg-white/70",
  design: "bg-white/50",
  qa: "bg-white/40",
  planejamento: "bg-state-green/80",
};

interface ProjectCardProps {
  project: Project;
}

function useOpenProject(projectId: string) {
  const router = useRouter();
  const { setPendingHref } = useInstantNav();

  return () => {
    const href = routes.projeto(projectId);
    setPendingHref(href);
    router.push(href);
  };
}

function useProjectActions(project: Project) {
  const open = useOpenProject(project.id);
  const { showSuccess, showInfo } = useFeedback();

  return [
    { id: "view", label: "Ver detalhes", onClick: open },
    { id: "edit", label: "Editar", onClick: () => showInfo(`Edição de ${project.name} em breve.`) },
    { id: "export", label: "Exportar", onClick: () => showSuccess(`${project.name} exportado com sucesso.`) },
    { id: "archive", label: "Arquivar", onClick: () => showInfo(`${project.name} arquivado.`), destructive: true },
  ];
}

export function ProjectCard({ project }: ProjectCardProps) {
  const open = useOpenProject(project.id);
  const items = useProjectActions(project);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      className="rounded-lg border border-border-subtle bg-surface/60 p-4 hover:border-border hover:bg-surface-hover/60 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
            <FolderKanban className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.client}</p>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActionMenu items={items} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/70 mb-3">
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", STAGE_DOT[project.stage] ?? "bg-white/50")} />
        {project.stageLabel}
      </span>

      <ProjectProgress value={project.progress} className="mb-3" />

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-muted-foreground">Entrega: {project.dueDate}</span>
        <ProjectAvatarGroup members={project.team} />
      </div>
    </div>
  );
}

export function PlanningProjectRow({ project }: ProjectCardProps) {
  const open = useOpenProject(project.id);
  const items = useProjectActions(project);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 rounded-lg border border-border-subtle bg-surface/60 px-4 py-3 hover:border-border hover:bg-surface-hover/60 transition-colors group cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
          <FolderKanban className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
          <p className="text-xs text-muted-foreground truncate">{project.client}</p>
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/70 lg:w-32 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-state-green/80 shrink-0" />
        {project.stageLabel}
      </span>

      <div className="flex items-center gap-2 lg:w-36 shrink-0">
        <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[9px] font-medium">
          {project.lead.initials}
        </div>
        <span className="text-xs text-muted-foreground truncate">{project.lead.name}</span>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-muted-foreground lg:w-48 shrink-0">
        <span>Início: {project.startDate}</span>
        <span>Entrega: {project.dueDate}</span>
      </div>

      <span className="text-[11px] text-foreground/50 tabular-nums lg:w-10 text-right shrink-0">{project.progress}%</span>

      <div onClick={(e) => e.stopPropagation()} className="shrink-0 ml-auto lg:ml-0">
        <ActionMenu items={items} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

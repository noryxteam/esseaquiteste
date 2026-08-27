"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";
import { PremiumProgressSlider } from "@/components/projetos/PremiumProgressSlider";
import { routes } from "@/lib/app-routes";
import { useAuth } from "@/contexts/auth-context";
import { useAppState } from "@/contexts/app-context";
import { useFeedback } from "@/contexts/feedback-context";
import { finalizeProject, getMergedProject, setProjectProgress } from "@/modules/project-workspace/store";
import { useProjectWorkspace } from "@/modules/project-workspace/use-project-workspace";
import { ProjectTimeline } from "@/modules/project-workspace/components/ProjectTimeline";
import { ProjectBlocks } from "@/modules/project-workspace/components/ProjectBlocks";
import { ProjectHistory } from "@/modules/project-workspace/components/ProjectHistory";
import { ClientProjectPortal } from "@/modules/client-portal/components/ClientProjectPortal";
import { formatDateBR } from "@/modules/project-workspace/utils";
import { useBriefingAutoAdvance } from "@/modules/project-workspace/hooks/use-briefing-auto-advance";
import { cn } from "@/lib/utils";

interface ProjectDetailPageProps {
  projectId: string;
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { invalidate } = useAppState();
  const { showSuccess } = useFeedback();
  const { workspace } = useProjectWorkspace(projectId);
  const [clientPreview, setClientPreview] = useState(false);

  useBriefingAutoAdvance(projectId, workspace.steps);

  const userName = user?.nome ?? "Equipe Norax";
  const project = useMemo(() => getMergedProject(projectId), [projectId, workspace]);

  if (!project) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(routes.projetos)}
          className="gap-1 -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <p className="text-muted-foreground">Projeto não encontrado.</p>
      </div>
    );
  }

  const isFinalized = Boolean(workspace.finalizedAt) || workspace.category === "concluido";

  const handleFinalize = () => {
    if (
      !window.confirm(
        `Finalizar o projeto "${project.name}"?\n\nStatus vai para Finalizado e o progresso para 100%.`
      )
    ) {
      return;
    }
    finalizeProject(projectId, userName);
    invalidate();
    showSuccess("Projeto finalizado e movido para concluídos.");
  };

  const handleProgressCommit = (value: number) => {
    setProjectProgress(projectId, value, userName);
    invalidate();
  };

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 gap-1 text-muted-foreground">
          <Link href={routes.projetos}>
            <ArrowLeft className="h-4 w-4" />
            Projetos
          </Link>
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center shrink-0">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground truncate">
                {project.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs border-border-subtle gap-1.5"
              onClick={() => setClientPreview(true)}
            >
              <Eye className="h-3.5 w-3.5" />
              Visualização do Cliente
            </Button>
            <Button
              type="button"
              size="sm"
              className={cn(
                "h-9 text-xs gap-1.5",
                isFinalized
                  ? "bg-surface-elevated text-muted-foreground border border-border-subtle"
                  : "bg-foreground text-accent-foreground hover:bg-foreground/90"
              )}
              disabled={isFinalized}
              onClick={handleFinalize}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isFinalized ? "Projeto finalizado" : "Finalizar Projeto"}
            </Button>
          </div>
        </div>
      </div>

      {/* Cabeçalho / meta */}
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
          <Meta label="Status" value={workspace.statusLabel} />
          <Meta label="Responsável" value={project.lead.name} />
          <Meta
            label="Criação"
            value={project.startDate || formatDateBR(workspace.createdAt)}
          />
          <Meta label="Prazo de entrega" value={project.dueDate} />
          <Meta
            label="Conclusão"
            value={
              workspace.finalizedAt
                ? formatDateBR(workspace.finalizedAt)
                : project.completedDate || "—"
            }
          />
          <Meta label="Progresso" value={`${workspace.progress}%`} />
        </div>
        <div>
          <PremiumProgressSlider
            value={workspace.progress}
            onCommit={handleProgressCommit}
            disabled={isFinalized}
          />
        </div>
      </section>

      {/* Timeline principal */}
      <ProjectTimeline
        projectId={projectId}
        steps={workspace.steps}
        userName={userName}
        readOnly={isFinalized}
      />

      {/* Blocos modulares */}
      <ProjectBlocks
        projectId={projectId}
        blocks={workspace.blocks}
        files={workspace.files}
        userName={userName}
        readOnly={isFinalized}
      />

      {/* Histórico */}
      <ProjectHistory entries={workspace.history} />

      <ClientProjectPortal
        open={clientPreview}
        onClose={() => setClientPreview(false)}
        project={project}
        workspace={workspace}
      />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground truncate">{value}</p>
    </div>
  );
}

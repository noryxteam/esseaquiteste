"use client";

import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2 } from "lucide-react";
import type { Project } from "@/lib/mock-data/projetos-types";
import { routes } from "@/lib/app-routes";
import { useInstantNav } from "@/contexts/instant-nav-context";

interface CompletedProjectCardProps {
  project: Project;
}

export function CompletedProjectCard({ project }: CompletedProjectCardProps) {
  const router = useRouter();
  const { setPendingHref } = useInstantNav();

  const open = () => {
    const href = routes.projeto(project.id);
    setPendingHref(href);
    router.push(href);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      className="rounded-lg border border-border-subtle bg-surface/60 p-4 hover:border-border hover:bg-surface-hover/60 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-md bg-state-green/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-4 w-4 text-state-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{project.client}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Concluído em {project.completedDate}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-5 w-5 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[8px] font-medium">
              {project.lead.initials}
            </div>
            <span className="text-[10px] text-muted-foreground">{project.lead.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import type { Project, ProjectSection as ProjectSectionType } from "@/lib/mock-data/projetos-types";
import { ProjectGrid } from "@/components/projetos/ProjectGrid";
import { Button } from "@/components/ui/button-shadcn";
import { routes } from "@/lib/app-routes";

interface ProjectSectionProps {
  section: ProjectSectionType;
  projects: Project[];
  viewOverride?: "grid" | "list";
}

export function ProjectSection({ section, projects, viewOverride }: ProjectSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">
          {section.title}
          <span className="text-muted-foreground font-normal ml-1.5">({projects.length})</span>
        </h2>
        {section.id === "concluido" && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-7 text-[10px] text-muted-foreground hover:text-foreground"
          >
            <Link href={routes.projetos}>Ver todos</Link>
          </Button>
        )}
      </div>
      <ProjectGrid
        projects={projects}
        view={section.view === "completed" ? "completed" : (viewOverride ?? section.view)}
      />
    </section>
  );
}

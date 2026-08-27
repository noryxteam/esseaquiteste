import type { Project } from "@/lib/mock-data/projetos-types";
import { ProjectCard, PlanningProjectRow } from "@/components/projetos/ProjectCard";
import { CompletedProjectCard } from "@/components/projetos/CompletedProjectCard";

interface ProjectGridProps {
  projects: Project[];
  view: "grid" | "list" | "completed";
}

export function ProjectGrid({ projects, view }: ProjectGridProps) {
  if (view === "list") {
    return (
      <div className="space-y-2">
        {projects.map((project) => (
          <PlanningProjectRow key={project.id} project={project} />
        ))}
      </div>
    );
  }

  if (view === "completed") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => (
          <CompletedProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

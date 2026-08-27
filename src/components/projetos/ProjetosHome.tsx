"use client";

import { startTransition, useMemo, useState, useSyncExternalStore } from "react";
import { projetosData } from "@/lib/mock-data/projetos";
import type { Project, ProjectSection as ProjectSectionType, ProjectTab } from "@/lib/mock-data/projetos-types";
import { ProjectHeader } from "@/components/projetos/ProjectHeader";
import { StatsCard } from "@/components/projetos/StatsCard";
import { SearchBar } from "@/components/projetos/SearchBar";
import { ProjectTabs } from "@/components/projetos/ProjectTabs";
import { ProjectFilters } from "@/components/projetos/ProjectFilters";
import { ProjectSection } from "@/components/projetos/ProjectSection";
import {
  applyWorkspaceOverrides,
  getProjectWorkspaceStoreVersion,
  subscribeProjectWorkspace,
} from "@/modules/project-workspace/store";
import { useAppState } from "@/contexts/app-context";

interface ProjetosHomeProps {
  data?: typeof projetosData;
}

const TAB_CATEGORY_MAP: Record<ProjectTab, string[] | null> = {
  todos: null,
  "em-andamento": ["em-andamento"],
  planejamento: ["planejamento"],
  pausados: [],
  concluidos: ["concluido"],
};

function matchesQuery(project: Project, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    project.name.toLowerCase().includes(q) ||
    project.client.toLowerCase().includes(q) ||
    project.lead.name.toLowerCase().includes(q) ||
    project.team.some((m) => m.name.toLowerCase().includes(q))
  );
}

function sortProjects(projects: Project[], sortBy: string | null): Project[] {
  if (!sortBy) return projects;
  const sorted = [...projects];
  switch (sortBy) {
    case "date":
    case "name":
      return sorted.sort((a, b) => {
        const da = a.startDate || a.dueDate || "";
        const db = b.startDate || b.dueDate || "";
        return da.localeCompare(db);
      });
    case "dueDate":
      return sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    case "progress":
      return sorted.sort((a, b) => b.progress - a.progress);
    default:
      return sorted;
  }
}

function rebuildSections(projects: Project[], baseSections: ProjectSectionType[]): ProjectSectionType[] {
  return baseSections.map((section) => ({
    ...section,
    projectIds: projects.filter((p) => p.category === section.id).map((p) => p.id),
  }));
}

export function ProjetosHome({ data = projetosData }: ProjetosHomeProps) {
  const { version } = useAppState();
  const wsVersion = useSyncExternalStore(
    subscribeProjectWorkspace,
    getProjectWorkspaceStoreVersion,
    () => 0
  );
  const [activeTab, setActiveTab] = useState<ProjectTab>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const combinedQuery = searchQuery || filterQuery;

  const projects = useMemo(
    () => applyWorkspaceOverrides(data.projects),
    [data.projects, version, wsVersion]
  );

  const sections = useMemo(
    () => rebuildSections(projects, data.sections),
    [projects, data.sections]
  );

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects]
  );

  const filteredSections = useMemo(() => {
    const allowed = TAB_CATEGORY_MAP[activeTab];
    return sections
      .filter((section) => section.id !== "planejamento")
      .filter((section) => !allowed || allowed.includes(section.id))
      .map((section) => ({
        section,
        projects: sortProjects(
          section.projectIds
            .map((id) => projectMap[id])
            .filter(Boolean)
            .filter((project) => matchesQuery(project, combinedQuery))
            .filter((project) => !stageFilter || project.stage === stageFilter),
          sortBy
        ),
      }))
      .filter(({ projects: list }) => list.length > 0 || activeTab !== "pausados");
  }, [activeTab, sections, projectMap, combinedQuery, stageFilter, sortBy]);

  const handleTabChange = (tab: ProjectTab) => {
    startTransition(() => setActiveTab(tab));
  };

  return (
    <div className="space-y-5">
      <ProjectHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {data.stats.map((stat, i) => (
          <StatsCard key={stat.id} {...stat} index={i} />
        ))}
      </div>

      <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <ProjectTabs active={activeTab} onChange={handleTabChange} />
        <ProjectFilters
          query={filterQuery}
          onQueryChange={setFilterQuery}
          view={viewMode}
          onViewChange={setViewMode}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      </div>

      <div className="space-y-8">
        {filteredSections.length > 0 ? (
          filteredSections.map(({ section, projects: sectionProjects }) => (
            <ProjectSection
              key={section.id}
              section={section}
              projects={sectionProjects}
              viewOverride={section.view === "grid" ? viewMode : undefined}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhum projeto encontrado para os filtros selecionados.
          </p>
        )}
      </div>
    </div>
  );
}

import { getSeedData } from "@/mock/seed";
import type { MockProject, ProjectStatus } from "./types";

export * from "./types";
export { projects } from "./data";

export function getProjects(): MockProject[] {
  return getSeedData().projects;
}

export function getProjectById(id: string): MockProject | undefined {
  return getSeedData().projects.find((p) => p.id === id);
}

export function getProjectsByClientId(clienteId: string): MockProject[] {
  return getSeedData().projects.filter((p) => p.clienteId === clienteId);
}

export function getProjectsByStatus(status: ProjectStatus): MockProject[] {
  return getSeedData().projects.filter((p) => p.status === status);
}

export function getProjectsByResponsavel(responsavelId: string): MockProject[] {
  return getSeedData().projects.filter((p) => p.responsavelId === responsavelId);
}

export function getActiveProjects(): MockProject[] {
  return getSeedData().projects.filter(
    (p) => p.status === "em-andamento" || p.status === "planejamento"
  );
}

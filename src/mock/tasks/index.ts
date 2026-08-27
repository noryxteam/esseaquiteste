import { getSeedData } from "@/mock/seed";
import type { MockTask, TaskStatus } from "./types";

export * from "./types";
export { tasks } from "./data";

export function getTasks(): MockTask[] {
  return getSeedData().tasks;
}

export function getTaskById(id: string): MockTask | undefined {
  return getSeedData().tasks.find((t) => t.id === id);
}

export function getTasksByProjectId(projetoId: string): MockTask[] {
  return getSeedData().tasks.filter((t) => t.projetoId === projetoId);
}

export function getTasksByClientId(clienteId: string): MockTask[] {
  return getSeedData().tasks.filter((t) => t.clienteId === clienteId);
}

export function getTasksByStatus(status: TaskStatus): MockTask[] {
  return getSeedData().tasks.filter((t) => t.status === status);
}

export function getTasksByResponsavel(responsavelId: string): MockTask[] {
  return getSeedData().tasks.filter((t) => t.responsavelId === responsavelId);
}

export function getPendingTasks(): MockTask[] {
  return getSeedData().tasks.filter(
    (t) => t.status === "pendente" || t.status === "em-andamento"
  );
}

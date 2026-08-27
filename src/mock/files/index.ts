import { getSeedData } from "@/mock/seed";
import type { FileCategory, MockFile } from "./types";

export * from "./types";
export { files } from "./data";

export function getFiles(): MockFile[] {
  return getSeedData().files;
}

export function getFileById(id: string): MockFile | undefined {
  return getSeedData().files.find((f) => f.id === id);
}

export function getFilesByClientId(clienteId: string): MockFile[] {
  return getSeedData().files.filter((f) => f.clienteId === clienteId);
}

export function getFilesByProjectId(projetoId: string): MockFile[] {
  return getSeedData().files.filter((f) => f.projetoId === projetoId);
}

export function getFilesByCategory(categoria: FileCategory): MockFile[] {
  return getSeedData().files.filter((f) => f.categoria === categoria);
}

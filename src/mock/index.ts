/**
 * Camada centralizada de dados simulados — Norax Agency OS.
 * Única fonte de dados durante o desenvolvimento do frontend.
 * No futuro, substituir helpers por chamadas à API sem alterar as telas.
 */

export { getSeedData, resetSeedData } from "@/mock/seed";
export type { MockSeedData } from "@/mock/seed";

export * from "@/mock/common";
export * from "@/mock/users";
export * from "@/mock/clients";
export * from "@/mock/projects";
export * from "@/mock/contracts";
export * from "@/mock/meetings";
export * from "@/mock/briefings";
export * from "@/mock/finance";
export * from "@/mock/tasks";
export * from "@/mock/files";
export * from "@/mock/timeline";
export * from "@/mock/notifications";
export * from "@/mock/settings";
export * from "@/mock/reports";
export * from "@/mock/dashboard";

// Aliases de conveniência
export { getClientById } from "@/mock/clients";
export { getProjectById, getProjectsByClientId } from "@/mock/projects";
export { getContractById, getContractsByClientId } from "@/mock/contracts";
export { getBriefingById, getBriefingByProjectId } from "@/mock/briefings";
export { getTasksByProjectId, getTasksByClientId } from "@/mock/tasks";
export { getFilesByProjectId, getFilesByClientId } from "@/mock/files";
export { getFinanceByClientId, getFinanceByContractId } from "@/mock/finance";
export { getTimelineByClientId, getTimelineByProjectId } from "@/mock/timeline";
export { getMeetingById } from "@/mock/meetings";

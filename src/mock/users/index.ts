import { getSeedData } from "@/mock/seed";
import type { MockUser, UserRole } from "./types";

export * from "./types";
export { users } from "./data";

export function getUsers(): MockUser[] {
  return getSeedData().users;
}

export function getUserById(id: string): MockUser | undefined {
  return getSeedData().users.find((u) => u.id === id);
}

export function getUsersByRole(role: UserRole): MockUser[] {
  return getSeedData().users.filter((u) => u.role === role);
}

export function getActiveUsers(): MockUser[] {
  return getSeedData().users.filter((u) => u.ativo);
}

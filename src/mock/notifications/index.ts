import { getSeedData } from "@/mock/seed";
import type { MockNotification } from "./types";

export * from "./types";
export { notifications } from "./data";

export function getNotifications(): MockNotification[] {
  return getSeedData().notifications;
}

export function getNotificationById(id: string): MockNotification | undefined {
  return getSeedData().notifications.find((n) => n.id === id);
}

export function getNotificationsByUserId(usuarioId: string): MockNotification[] {
  return getSeedData().notifications.filter((n) => n.usuarioId === usuarioId);
}

export function getUnreadNotifications(): MockNotification[] {
  return getSeedData().notifications.filter((n) => !n.lida);
}

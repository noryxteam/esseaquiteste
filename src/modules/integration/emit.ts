import { integrationEventBus } from "@/modules/integration/event-bus";
import {
  DomainEventType,
  type AffectedModule,
  type DomainEvent,
  type EventPayloadMap,
} from "@/modules/integration/types";
const DEFAULT_AFFECTED: Record<Exclude<DomainEventType, DomainEventType.STATE_INVALIDATED>, AffectedModule[]> = {
  CLIENT_CREATED: ["dashboard", "clients", "reports", "timeline", "notifications", "search", "sidebar"],
  CLIENT_UPDATED: ["dashboard", "clients", "reports", "search"],
  PROJECT_CREATED: ["dashboard", "projects", "clients", "briefings", "timeline", "reports", "search", "sidebar"],
  PROJECT_UPDATED: ["dashboard", "projects", "clients", "reports", "notifications", "sidebar"],
  PROJECT_COMPLETED: ["dashboard", "projects", "reports", "timeline", "notifications", "sidebar"],
  CONTRACT_CREATED: ["dashboard", "contracts", "projects", "clients", "timeline", "search", "sidebar"],
  CONTRACT_STATUS_CHANGED: ["dashboard", "contracts", "projects", "clients", "finance", "notifications", "sidebar"],
  CONTRACT_SIGNED: ["dashboard", "contracts", "projects", "finance", "timeline", "notifications", "sidebar"],
  PAYMENT_CONFIRMED: ["dashboard", "finance", "contracts", "reports", "timeline", "clients", "notifications", "sidebar"],
  PAYMENT_PENDING: ["dashboard", "finance", "timeline", "notifications"],
  MEETING_FINISHED: ["dashboard", "meetings", "briefings", "timeline", "clients", "projects", "sidebar"],
  BRIEFING_CREATED: ["dashboard", "briefings", "projects", "timeline", "search", "sidebar"],
  FILE_UPLOADED: ["dashboard", "files", "projects", "clients", "timeline", "search"],
  TASK_COMPLETED: ["dashboard", "tasks", "projects", "timeline", "sidebar"],
  TASK_CREATED: ["dashboard", "tasks", "projects", "notifications", "sidebar"],
};

export async function emitIntegrationEvent<T extends Exclude<DomainEventType, DomainEventType.STATE_INVALIDATED>>(
  type: T,
  payload: EventPayloadMap[T],
  affectedModules?: AffectedModule[]
): Promise<void> {
  const event = {
    type,
    payload,
    affectedModules: affectedModules ?? DEFAULT_AFFECTED[type],
    timestamp: new Date(),
  } as import("@/modules/integration/types").AnyDomainEvent;
  await integrationEventBus.emit(event);
}

export async function invalidateModules(modules: AffectedModule[]): Promise<void> {
  await integrationEventBus.emit({
    type: DomainEventType.STATE_INVALIDATED,
    payload: { modules },
    affectedModules: modules,
    timestamp: new Date(),
  });
}

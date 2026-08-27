import { eventBus } from "@/shared/events/event-bus";
import type { AffectedModule, DomainEvent, EventPayloadMap } from "@/shared/events/types";
import { DomainEventType } from "@/shared/events/types";
import type { RequestContext } from "@/shared/types/api";

export interface EmitOptions<T extends DomainEventType> {
  type: T;
  payload: EventPayloadMap[T];
  context?: RequestContext;
  affectedModules?: AffectedModule[];
}

const DEFAULT_AFFECTED: Record<DomainEventType, AffectedModule[]> = {
  [DomainEventType.CLIENT_CREATED]: ["dashboard", "clients", "reports", "timeline", "notifications", "search"],
  [DomainEventType.CLIENT_UPDATED]: ["dashboard", "clients", "reports", "search"],
  [DomainEventType.PROJECT_CREATED]: [
    "dashboard",
    "projects",
    "clients",
    "briefings",
    "timeline",
    "reports",
    "search",
  ],
  [DomainEventType.PROJECT_UPDATED]: ["dashboard", "projects", "clients", "reports", "notifications"],
  [DomainEventType.PROJECT_COMPLETED]: ["dashboard", "projects", "reports", "timeline", "notifications"],
  [DomainEventType.CONTRACT_CREATED]: ["dashboard", "contracts", "projects", "clients", "timeline", "search"],
  [DomainEventType.CONTRACT_STATUS_CHANGED]: ["dashboard", "contracts", "projects", "clients", "finance", "notifications"],
  [DomainEventType.CONTRACT_SIGNED]: ["dashboard", "contracts", "projects", "finance", "timeline", "notifications"],
  [DomainEventType.PAYMENT_CONFIRMED]: ["dashboard", "finance", "contracts", "reports", "timeline", "clients", "notifications"],
  [DomainEventType.PAYMENT_PENDING]: ["dashboard", "finance", "timeline", "notifications"],
  [DomainEventType.MEETING_FINISHED]: ["dashboard", "meetings", "briefings", "tasks", "timeline", "clients", "projects"],
  [DomainEventType.BRIEFING_CREATED]: ["dashboard", "briefings", "projects", "timeline", "search"],
  [DomainEventType.FILE_UPLOADED]: ["dashboard", "files", "projects", "clients", "timeline", "search"],
  [DomainEventType.TASK_COMPLETED]: ["dashboard", "tasks", "projects", "timeline"],
  [DomainEventType.TASK_CREATED]: ["dashboard", "tasks", "projects", "notifications"],
};

export async function emitDomainEvent<T extends DomainEventType>(
  options: EmitOptions<T>
): Promise<void> {
  const event = {
    type: options.type,
    payload: options.payload,
    context: options.context,
    affectedModules: options.affectedModules ?? DEFAULT_AFFECTED[options.type],
    timestamp: new Date(),
  } as import("@/shared/events/types").AnyDomainEvent;
  await eventBus.emit(event);
}

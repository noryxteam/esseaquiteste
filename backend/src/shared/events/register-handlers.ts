import { eventBus } from "@/shared/events/event-bus";
import { DomainEventType } from "@/shared/events/types";
import { timelineHandler } from "@/shared/events/handlers/timeline.handler";
import { notificationHandler } from "@/shared/events/handlers/notification.handler";
import { integrationHandler } from "@/shared/events/handlers/integration.handler";

const TIMELINE_EVENTS = new Set<DomainEventType>([
  DomainEventType.CLIENT_CREATED,
  DomainEventType.PROJECT_CREATED,
  DomainEventType.PROJECT_COMPLETED,
  DomainEventType.CONTRACT_CREATED,
  DomainEventType.CONTRACT_SIGNED,
  DomainEventType.PAYMENT_CONFIRMED,
  DomainEventType.PAYMENT_PENDING,
  DomainEventType.MEETING_FINISHED,
  DomainEventType.BRIEFING_CREATED,
  DomainEventType.FILE_UPLOADED,
  DomainEventType.TASK_COMPLETED,
]);

const NOTIFICATION_EVENTS = new Set<DomainEventType>([
  DomainEventType.CLIENT_CREATED,
  DomainEventType.CONTRACT_SIGNED,
  DomainEventType.PAYMENT_CONFIRMED,
  DomainEventType.MEETING_FINISHED,
  DomainEventType.PROJECT_COMPLETED,
  DomainEventType.PROJECT_UPDATED,
]);

const INTEGRATION_EVENTS = new Set<DomainEventType>([
  DomainEventType.MEETING_FINISHED,
  DomainEventType.PROJECT_CREATED,
  DomainEventType.PROJECT_UPDATED,
  DomainEventType.CONTRACT_STATUS_CHANGED,
  DomainEventType.PAYMENT_CONFIRMED,
]);

export function registerEventHandlers(): void {
  for (const type of Object.values(DomainEventType)) {
    if (TIMELINE_EVENTS.has(type)) {
      eventBus.on(type, timelineHandler.handle);
    }
    if (NOTIFICATION_EVENTS.has(type)) {
      eventBus.on(type, notificationHandler.handle);
    }
    if (INTEGRATION_EVENTS.has(type)) {
      eventBus.on(type, integrationHandler.handle);
    }
  }
}

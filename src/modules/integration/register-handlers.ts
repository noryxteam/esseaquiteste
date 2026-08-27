import { integrationEventBus } from "@/modules/integration/event-bus";
import {
  localNotificationHandler,
  localStateHandler,
  localTimelineHandler,
} from "@/modules/integration/handlers";
import { DomainEventType } from "@/modules/integration/types";

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

let registered = false;

export function registerIntegrationHandlers(): void {
  if (registered) return;
  registered = true;

  for (const type of Object.values(DomainEventType)) {
    if (type === DomainEventType.STATE_INVALIDATED) continue;

    integrationEventBus.on(type, async (event) => {
      if (TIMELINE_EVENTS.has(event.type)) {
        localTimelineHandler.handle(event);
      }
      if (NOTIFICATION_EVENTS.has(event.type)) {
        localNotificationHandler.handle(event);
      }
      await localStateHandler.handle(event);
    });
  }

  integrationEventBus.on(DomainEventType.STATE_INVALIDATED, () => {
    // Apenas propaga para AppProvider — sem efeitos colaterais
  });
}

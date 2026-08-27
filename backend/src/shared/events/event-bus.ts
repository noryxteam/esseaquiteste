import { logger } from "@/shared/services/logger.service";
import type { AnyDomainEvent, DomainEventHandler, DomainEventType } from "@/shared/events/types";

type HandlerMap = Partial<Record<DomainEventType, DomainEventHandler[]>>;

/**
 * Barramento de eventos interno — desacoplado e preparado para WebSocket.
 * Handlers executam em paralelo; falhas individuais não bloqueiam os demais.
 */
class EventBus {
  private handlers: HandlerMap = {};

  on(type: DomainEventType, handler: DomainEventHandler): void {
    const list = (this.handlers[type] ??= []);
    list.push(handler);
  }

  async emit(event: AnyDomainEvent): Promise<void> {
    const list = this.handlers[event.type] ?? [];
    if (list.length === 0) return;

    logger.info("Domain event", {
      type: event.type,
      affectedModules: event.affectedModules,
    });

    await Promise.allSettled(
      list.map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          logger.error("Event handler failed", { type: event.type, error });
        }
      })
    );
  }
}

export const eventBus = new EventBus();

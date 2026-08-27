import type { AnyDomainEvent, DomainEventHandler, DomainEventType } from "@/modules/integration/types";

type HandlerMap = Partial<Record<DomainEventType, DomainEventHandler[]>>;

class IntegrationEventBus {
  private handlers: HandlerMap = {};

  on(type: DomainEventType, handler: DomainEventHandler): () => void {
    const list = (this.handlers[type] ??= []);
    list.push(handler);
    return () => {
      const idx = list.indexOf(handler);
      if (idx >= 0) list.splice(idx, 1);
    };
  }

  async emit(event: AnyDomainEvent): Promise<void> {
    const list = this.handlers[event.type] ?? [];
    await Promise.all(list.map((h) => Promise.resolve(h(event))));
  }
}

export const integrationEventBus = new IntegrationEventBus();

"use client";

import { AnimatePresence } from "framer-motion";
import type { ClientTimelineItem } from "@/modules/client-portal/types";
import { ClientPortalTimelineStep } from "@/modules/client-portal/components/ClientPortalTimelineStep";

interface ClientPortalTimelineProps {
  items: ClientTimelineItem[];
}

export function ClientPortalTimeline({ items }: ClientPortalTimelineProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight portal-fg">Linha do tempo</h2>
        <p className="mt-1 text-sm portal-muted">
          Acompanhe todas as etapas do seu projeto.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="portal-card rounded-xl border px-5 py-12 text-center">
          <p className="text-sm portal-muted">
            As etapas do seu projeto aparecerão aqui assim que o acompanhamento for liberado.
          </p>
        </div>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <ClientPortalTimelineStep
                key={item.id}
                item={item}
                index={index}
                isLast={index === items.length - 1}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

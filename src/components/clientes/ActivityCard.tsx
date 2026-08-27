"use client";

import type { ClientActivity } from "@/lib/mock-data/clientes-types";

/** Altura aproximada de 5 itens — o restante rola por dentro do card. */
const ACTIVITY_VISIBLE_MAX = "max-h-[280px]";

interface ActivityCardProps {
  items: ClientActivity[];
}

export function ActivityCard({ items }: ActivityCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 hover:border-border-strong transition-colors">
      <p className="text-sm font-medium text-foreground mb-4">Atividade recente</p>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">Nenhuma atividade recente.</p>
      ) : (
        <ul className={`${ACTIVITY_VISIBLE_MAX} space-y-3 overflow-y-auto pr-1`}>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-2.5 group rounded-md -mx-1 px-1 py-1 hover:bg-surface-hover/50 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

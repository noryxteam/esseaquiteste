"use client";

import { useRouter } from "next/navigation";
import type { AgendaItem } from "@/lib/mock-data/types";
import { routes } from "@/lib/app-routes";

interface AgendaWidgetProps {
  items: AgendaItem[];
}

export function AgendaWidget({ items }: AgendaWidgetProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg border border-border bg-surface p-4 hover:border-border-strong transition-colors">
      <p className="text-sm font-medium mb-4 text-foreground">Agenda de hoje</p>
      <ul className="space-y-0">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-3 relative">
            {i < items.length - 1 && (
              <span className="absolute left-[3px] top-6 bottom-0 w-px bg-border" />
            )}
            <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0 bg-white" />
            <button
              type="button"
              onClick={() => router.push(routes.reuniao(item.id))}
              className="flex-1 min-w-0 pb-4 text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-xs font-medium text-muted-foreground tabular-nums">{item.time}</span>
              <p className="text-sm text-foreground mt-0.5 truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {item.project} · {item.client}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

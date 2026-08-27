"use client";

import Link from "next/link";
import { useState } from "react";
import type { ClientTask } from "@/lib/mock-data/clientes-types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/app-routes";

const PRIORITY_STYLES = {
  alta: "text-foreground/80 bg-white/8 border-white/10",
  media: "text-muted-foreground bg-surface-elevated border-border-subtle",
  baixa: "text-muted-foreground bg-surface-elevated border-border-subtle",
} as const;

const PRIORITY_LABELS = {
  alta: "Prioridade alta",
  media: "Prioridade média",
  baixa: "Prioridade baixa",
} as const;

interface TasksCardProps {
  items: ClientTask[];
}

export function TasksCard({ items: initialItems }: TasksCardProps) {
  const [items, setItems] = useState(initialItems);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4 hover:border-border-strong transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-foreground">Tarefas relacionadas</p>
        <Button variant="ghost" size="sm" asChild className="h-7 text-[10px] text-muted-foreground hover:text-foreground px-2">
          <Link href={routes.tasks}>Ver todas</Link>
        </Button>
      </div>
      <ul className="space-y-3">
        {items.map((task) => (
          <li key={task.id} className="flex items-start gap-2.5">
            <Checkbox checked={task.completed} onCheckedChange={() => toggle(task.id)} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm transition-colors",
                  task.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border",
                    PRIORITY_STYLES[task.priority]
                  )}
                >
                  {PRIORITY_LABELS[task.priority]}
                </span>
                <span className="text-[10px] text-muted-foreground">{task.time}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

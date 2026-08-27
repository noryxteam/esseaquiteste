"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { TaskItem } from "@/lib/mock-data/types";
import { PRIORITY_LABELS } from "@/components/dashboard/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button-shadcn";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/app-routes";

interface TasksWidgetProps {
  items: TaskItem[];
}

export function TasksWidget({ items: initialItems }: TasksWidgetProps) {
  const [items, setItems] = useState(initialItems);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4 hover:border-border-strong transition-colors">
      <p className="text-sm font-medium mb-4">Tasks do dia</p>
      <ul className="space-y-3">
        {items.map((task) => {
          const priority = PRIORITY_LABELS[task.priority];
          return (
            <li key={task.id}>
              <Link
                href={routes.tasks}
                className="flex items-start gap-3 group"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggle(task.id)}
                  onClick={(e) => e.preventDefault()}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm transition-colors", task.completed ? "text-muted-foreground line-through" : "text-foreground")}>
                    {task.title}
                  </p>
                  <span className={cn("inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded border border-white/10", priority.className)}>
                    {priority.label}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Button variant="ghost" asChild className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8">
        <Link href={routes.tasks}>
          <Plus className="h-3.5 w-3.5" />
          Nova task
        </Link>
      </Button>
    </div>
  );
}

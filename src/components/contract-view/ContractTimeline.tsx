"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { ContractTimelineEvent } from "@/lib/mock-data/contract-view-types";
import { cn } from "@/lib/utils";

interface ContractTimelineProps {
  events: ContractTimelineEvent[];
}

export function ContractTimeline({ events }: ContractTimelineProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-5">
      <h2 className="text-sm font-medium text-foreground mb-5">Linha do tempo</h2>

      <div className="space-y-0">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                {event.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-state-green shrink-0" />
                ) : event.pending ? (
                  <Clock className="h-4 w-4 text-state-orange shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                )}
                {!isLast && <div className="w-px flex-1 bg-border-subtle min-h-[28px] my-1" />}
              </div>

              <div className={cn("pb-5 min-w-0", isLast && "pb-0")}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium text-foreground">{event.title}</p>
                  {event.date !== "—" && (
                    <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                      {event.date} · {event.time}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{event.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

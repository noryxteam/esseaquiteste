"use client";

import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Code2,
  FileCheck,
  Flag,
  Rocket,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineStep } from "@/modules/project-workspace/types";
import {
  FIXED_TIMELINE,
  getFixedVisualStatus,
} from "@/modules/project-workspace/fixed-timeline";
import { getTimelineStepCopy } from "@/modules/project-workspace/timeline-copy";

const ICONS: Record<string, LucideIcon> = {
  Flag,
  ClipboardList,
  FileCheck,
  Code2,
  Search,
  Rocket,
  Trophy,
};

export interface FixedTimelineViewProps {
  steps: TimelineStep[];
  onStepClick?: (step: TimelineStep, index: number) => void;
  readOnly?: boolean;
  hideHeader?: boolean;
}

export function FixedTimelineView({
  steps,
  onStepClick,
  readOnly,
  hideHeader,
}: FixedTimelineViewProps) {
  return (
    <section className="space-y-5">
      {!hideHeader && (
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Linha do tempo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe todas as etapas do seu projeto.
          </p>
        </div>
      )}

      <ul>
        {steps.map((step, index) => {
          const def = FIXED_TIMELINE[index];
          const visual = getFixedVisualStatus(steps, index);
          const copy = getTimelineStepCopy(step, visual, def?.key ?? step.fixedKey);
          const Icon = ICONS[def?.icon ?? "Flag"] ?? Flag;
          const done = visual === "completed";
          const active = visual === "active";
          const isLast = index === steps.length - 1;
          const clickable = !readOnly && Boolean(onStepClick);

          return (
            <motion.li
              key={step.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4 pb-5 last:pb-0"
            >
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-[15px] top-8 bottom-0 w-px",
                    done ? "bg-foreground/35" : "bg-border-subtle"
                  )}
                  aria-hidden
                />
              )}

              <div className="relative z-[1] mt-3 shrink-0">
                <motion.div
                  className={cn(
                    "h-8 w-8 rounded-full border flex items-center justify-center",
                    done && "bg-foreground border-foreground text-accent-foreground",
                    active &&
                      "bg-foreground border-foreground text-accent-foreground shadow-[0_0_16px_rgba(250,250,250,0.25)]",
                    !done && !active && "bg-surface border-border-subtle text-muted-foreground"
                  )}
                  animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                  transition={
                    active
                      ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.4 }
                  }
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  )}
                </motion.div>
              </div>

              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => onStepClick?.(step, index)}
                whileHover={clickable ? { y: -2 } : undefined}
                className={cn(
                  "flex-1 min-w-0 text-left rounded-xl border p-4 sm:p-5 transition-colors",
                  "bg-surface/60 border-border-subtle",
                  active && "border-border bg-surface shadow-[0_0_0_1px_rgba(250,250,250,0.08)]",
                  done && "opacity-90",
                  !done && !active && "opacity-70",
                  clickable && "cursor-pointer hover:border-border hover:bg-surface-hover/40",
                  !clickable && "cursor-default"
                )}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] gap-3 lg:gap-6 lg:items-center">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg border border-border-subtle flex items-center justify-center shrink-0",
                        active && "border-foreground/30"
                      )}
                    >
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{copy.title}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{copy.subline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed lg:text-center px-0 lg:px-2 lowercase">
                    {copy.center}
                  </p>

                  <div className="lg:justify-self-end">
                    <StatusBadge
                      label={copy.badge}
                      status={visual}
                      accent={copy.badgeAccent}
                    />
                  </div>
                </div>
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

function StatusBadge({
  label,
  status,
  accent,
}: {
  label: string;
  status: "pending" | "active" | "completed";
  accent?: "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 self-start rounded-full border border-border-subtle px-2.5 py-1 text-[10px] shrink-0 text-muted-foreground",
        status === "active" && "text-foreground",
        accent === "success" && "text-foreground border-white/25"
      )}
    >
      {status === "active" && (
        <span className="flex gap-0.5" aria-hidden>
          <span className="h-1 w-1 rounded-full bg-current animate-pulse" />
          <span className="h-1 w-1 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
          <span className="h-1 w-1 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
        </span>
      )}
      {label}
      {accent === "success" && (
        <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" strokeWidth={2} aria-hidden />
      )}
    </span>
  );
}

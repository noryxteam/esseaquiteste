"use client";

import { motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Code2,
  FileCheck,
  Flag,
  Package,
  Palette,
  Rocket,
  Search,
  Server,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClientTimelineItem } from "@/modules/client-portal/types";

const ICONS: Record<string, LucideIcon> = {
  Flag,
  ClipboardList,
  FileCheck,
  Code2,
  Search,
  Rocket,
  Trophy,
  Package,
  Palette,
  Server,
  CheckCircle2: Check,
};

interface ClientPortalTimelineStepProps {
  item: ClientTimelineItem;
  index: number;
  isLast: boolean;
}

export function ClientPortalTimelineStep({ item, index, isLast }: ClientPortalTimelineStepProps) {
  const Icon = ICONS[item.icon] ?? Flag;
  const done = item.status === "completed";
  const active = item.status === "active";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4 pb-5 last:pb-0"
    >
      {!isLast && (
        <span
          className={cn(
            "absolute left-[15px] top-8 bottom-0 w-px",
            done ? "portal-line-done" : "portal-line"
          )}
          aria-hidden
        />
      )}

      <div className="relative z-[1] mt-3 shrink-0">
        <motion.div
          className={cn(
            "h-8 w-8 rounded-full border flex items-center justify-center",
            done && "portal-node-done",
            active && "portal-node-active",
            !done && !active && "portal-node-pending"
          )}
          animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={
            active
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.45 }
          }
        >
          {done ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          )}
        </motion.div>
      </div>

      <motion.div
        className={cn(
          "flex-1 min-w-0 rounded-xl border p-4 sm:p-5 portal-card transition-[box-shadow,border-color,background-color] duration-500",
          active && "portal-card-active",
          done && "portal-card-done",
          !done && !active && "opacity-70"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] gap-3 lg:gap-6 lg:items-center">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={cn(
                "h-9 w-9 rounded-lg border portal-ring flex items-center justify-center shrink-0",
                active && "portal-icon-active"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium portal-fg">{item.name}</p>
              <p className="mt-1 text-[11px] portal-muted">{item.dateLabel}</p>
            </div>
          </div>

          <p className="text-xs portal-muted leading-relaxed lg:text-center px-0 lg:px-2 lowercase">
            {item.description}
          </p>

          <div className="lg:justify-self-end">
            <StatusBadge item={item} />
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}

function StatusBadge({ item }: { item: ClientTimelineItem }) {
  const label =
    item.badgeLabel ??
    (item.status === "completed"
      ? "Concluído"
      : item.status === "active"
        ? "Em andamento"
        : "Pendente");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-[10px] shrink-0",
        item.status === "completed" && "portal-badge-done",
        item.status === "active" && "portal-badge-active",
        item.status === "pending" && "portal-badge-pending",
        item.badgeAccent === "success" && "text-white border-white/25"
      )}
    >
      {item.status === "active" && (
        <span className="flex gap-0.5" aria-hidden>
          <span className="h-1 w-1 rounded-full bg-current animate-pulse" />
          <span className="h-1 w-1 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
          <span className="h-1 w-1 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
        </span>
      )}
      {label}
      {item.badgeAccent === "success" && (
        <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" strokeWidth={2} aria-hidden />
      )}
    </span>
  );
}

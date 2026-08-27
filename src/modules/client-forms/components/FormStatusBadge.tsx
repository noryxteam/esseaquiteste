"use client";

import { cn } from "@/lib/utils";
import type { FormStatus } from "@/modules/client-forms/types";
import { FORM_STATUS_LABELS } from "@/modules/client-forms/types";

const STYLES: Record<FormStatus, string> = {
  draft: "border-white/15 bg-white/5 text-white/60",
  sent: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  answered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  archived: "border-white/10 bg-white/[0.03] text-white/40",
};

export function FormStatusBadge({ status }: { status: FormStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
        STYLES[status]
      )}
    >
      {FORM_STATUS_LABELS[status]}
    </span>
  );
}

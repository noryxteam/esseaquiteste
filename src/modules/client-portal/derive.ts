import type { TimelineStep } from "@/modules/project-workspace/types";
import type { ClientTimelineItem } from "@/modules/client-portal/types";
import { FIXED_TIMELINE, getFixedVisualStatus } from "@/modules/project-workspace/fixed-timeline";
import { getTimelineStepCopy } from "@/modules/project-workspace/timeline-copy";

/**
 * Timeline oficial (7 etapas) → visual do portal do cliente.
 */
export function deriveClientTimeline(steps: TimelineStep[]): ClientTimelineItem[] {
  return steps.map((step, index) => {
    const def = FIXED_TIMELINE[index];
    const status = getFixedVisualStatus(steps, index);
    const copy = getTimelineStepCopy(step, status, def?.key ?? step.fixedKey);

    return {
      id: step.id,
      name: copy.title,
      description: copy.center,
      dateLabel: copy.subline,
      status,
      icon: def?.icon ?? "Flag",
      badgeLabel: copy.badge,
      badgeAccent: copy.badgeAccent,
    };
  });
}

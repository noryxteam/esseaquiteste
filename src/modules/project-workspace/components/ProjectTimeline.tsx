"use client";

import { useState } from "react";
import type { TimelineStep } from "@/modules/project-workspace/types";
import { canCompleteFixedStep } from "@/modules/project-workspace/fixed-timeline";
import { FixedTimelineView } from "@/modules/project-workspace/components/fixed-timeline/FixedTimelineView";
import { FixedStepFormModal } from "@/modules/project-workspace/components/fixed-timeline/FixedStepFormModal";
import { useFeedback } from "@/contexts/feedback-context";

interface ProjectTimelineProps {
  projectId: string;
  steps: TimelineStep[];
  userName: string;
  readOnly?: boolean;
  clientMode?: boolean;
}

/**
 * Timeline oficial Norax — 7 etapas fixas, ordem obrigatória.
 */
export function ProjectTimeline({
  projectId,
  steps,
  userName,
  readOnly = false,
  clientMode = false,
}: ProjectTimelineProps) {
  const { showInfo } = useFeedback();
  const [editing, setEditing] = useState<TimelineStep | null>(null);

  const handleClick = (step: TimelineStep) => {
    if (readOnly || clientMode) return;
    const gate = canCompleteFixedStep(steps, step.id);
    if (step.status !== "completed" && !gate.ok) {
      showInfo(gate.message ?? "Conclua primeiro a etapa anterior para continuar o fluxo do projeto.");
      return;
    }
    setEditing(step);
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-6">
      <FixedTimelineView
        steps={steps}
        readOnly={readOnly || clientMode}
        onStepClick={readOnly || clientMode ? undefined : handleClick}
      />

      {!readOnly && !clientMode && (
        <FixedStepFormModal
          open={Boolean(editing)}
          step={editing}
          steps={steps}
          projectId={projectId}
          userName={userName}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useOverlayChrome } from "@/contexts/overlay-chrome-context";
import type { Project } from "@/lib/mock-data/projetos-types";
import type { ProjectWorkspaceState } from "@/modules/project-workspace/types";
import {
  deriveClientTimeline,
} from "@/modules/client-portal/derive";
import { PortalThemeProvider } from "@/modules/client-portal/components/PortalThemeProvider";
import { ClientPortalHeader } from "@/modules/client-portal/components/ClientPortalHeader";
import { ClientPortalBanner } from "@/modules/client-portal/components/ClientPortalBanner";
import { ClientPortalTimeline } from "@/modules/client-portal/components/ClientPortalTimeline";
import { ClientPortalTrust } from "@/modules/client-portal/components/ClientPortalTrust";
import { ClientPortalSkeleton } from "@/modules/client-portal/components/ClientPortalSkeleton";
import { useBriefingAutoAdvance } from "@/modules/project-workspace/hooks/use-briefing-auto-advance";

interface ClientProjectPortalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  workspace: ProjectWorkspaceState;
}

export function ClientProjectPortal({
  open,
  onClose,
  project,
  workspace,
}: ClientProjectPortalProps) {
  const { setOverlayOpen } = useOverlayChrome();
  const [booting, setBooting] = useState(true);

  useBriefingAutoAdvance(project.id, workspace.steps);

  useEffect(() => {
    if (!open) return;
    setOverlayOpen(true);
    setBooting(true);
    const t = window.setTimeout(() => setBooting(false), 520);
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      setOverlayOpen(false);
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, onClose, setOverlayOpen]);

  const timeline = useMemo(
    () => deriveClientTimeline(workspace.steps),
    [workspace.steps]
  );
  const progress = useMemo(
    () => (workspace.finalizedAt ? 100 : workspace.progress),
    [workspace.progress, workspace.finalizedAt]
  );

  const initials = project.client
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "CL";

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[180] overflow-y-auto">
      <PortalThemeProvider>
        <motion.div
          className="min-h-full portal-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          {booting ? (
            <ClientPortalSkeleton />
          ) : (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
              <ClientPortalHeader
                projectName={project.name}
                clientName={project.client}
                statusLabel={workspace.statusLabel}
                dueDate={project.dueDate}
                progress={progress}
                clientInitials={initials}
                onClose={onClose}
              />
              <ClientPortalBanner />
              <ClientPortalTimeline items={timeline} />
              <ClientPortalTrust />
            </div>
          )}
        </motion.div>
      </PortalThemeProvider>
    </div>,
    document.body
  );
}

/** @deprecated Use ClientProjectPortal */
export { ClientProjectPortal as ClientPreview };

"use client";

import { useRouter } from "next/navigation";
import type { Meeting } from "@/lib/mock-data/reunioes-types";
import { MeetingBadge } from "@/components/reunioes/MeetingBadge";
import { MeetingParticipants } from "@/components/reunioes/MeetingParticipants";
import { ActionMenu } from "@/components/ui/action-menu";
import { useFeedback } from "@/contexts/feedback-context";
import { routes } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

interface MeetingCardProps {
  meeting: Meeting;
  isActive?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function MeetingCard({ meeting, isActive, onClick, compact }: MeetingCardProps) {
  const router = useRouter();
  const { showInfo } = useFeedback();

  const handleNavigate = () => {
    onClick?.();
    router.push(routes.reuniao(meeting.id));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border bg-surface/60 transition-all duration-200 group",
        "hover:border-border hover:bg-surface-hover/60",
        isActive
          ? "border-border border-l-2 border-l-foreground"
          : "border-border-subtle",
        compact ? "p-3" : "p-4"
      )}
    >
      <ActionMenu
        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        items={[
          { id: "view", label: "Visualizar", onClick: handleNavigate },
          { id: "edit", label: "Editar", onClick: () => showInfo("Edição de reunião em breve.") },
          {
            id: "cancel",
            label: "Cancelar reunião",
            destructive: true,
            onClick: () => showInfo("Cancelamento em breve."),
          },
        ]}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={handleKeyDown}
        className={cn(
          "text-left cursor-pointer pr-8",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border rounded-sm"
        )}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{meeting.title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {meeting.project} · {meeting.client}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-3 min-w-0">
            <MeetingParticipants participants={meeting.participants} />
            <MeetingBadge type={meeting.type} label={meeting.typeLabel} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[9px] font-medium">
              {meeting.lead.initials}
            </div>
            <span className="text-[11px] text-muted-foreground hidden sm:inline truncate max-w-[100px]">
              {meeting.lead.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

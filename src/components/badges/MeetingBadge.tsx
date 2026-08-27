import type { MeetingStatus, StatusColor } from "../common/types";
import { BadgeBase } from "./BadgeBase";

const MEETING_COLORS: Record<MeetingStatus, StatusColor> = {
  agendada: "blue",
  "em-andamento": "orange",
  concluida: "green",
};

const MEETING_LABELS: Record<MeetingStatus, string> = {
  agendada: "Agendada",
  "em-andamento": "Em andamento",
  concluida: "Concluída",
};

export interface MeetingBadgeProps {
  status: MeetingStatus;
  label?: string;
  className?: string;
}

export function MeetingBadge({ status, label, className }: MeetingBadgeProps) {
  return (
    <BadgeBase
      label={label ?? MEETING_LABELS[status]}
      color={MEETING_COLORS[status]}
      className={className}
    />
  );
}

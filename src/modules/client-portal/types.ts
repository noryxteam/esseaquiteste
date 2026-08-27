export type ClientStepVisualStatus = "pending" | "active" | "completed";

export interface ClientTimelineItem {
  id: string;
  name: string;
  description: string;
  dateLabel: string;
  status: ClientStepVisualStatus;
  icon: string;
  badgeLabel?: string;
  badgeAccent?: "success";
}

export type PortalTheme = "dark" | "light";
/** @deprecated Use PortalTheme */
export type ClientPortalTheme = PortalTheme;

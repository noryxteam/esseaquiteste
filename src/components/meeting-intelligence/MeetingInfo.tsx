import {
  Building2,
  Check,
  CircleDot,
  FileText,
  FolderKanban,
  Sparkles,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { MeetingInfoItem } from "@/lib/mock-data/meeting-intelligence-types";

const ICON_MAP: Record<string, LucideIcon> = {
  FolderKanban,
  Building2,
  Video,
  CircleDot,
  FileText,
  Sparkles,
};

interface MeetingInfoProps {
  items: MeetingInfoItem[];
}

export function MeetingInfo({ items }: MeetingInfoProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface/60 p-4">
      <h2 className="text-sm font-medium text-foreground mb-4">Informações da reunião</h2>
      <ul className="space-y-3">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? FileText;
          return (
            <li key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-[11px] text-muted-foreground truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-foreground/80">{item.value}</span>
                {item.status === "done" && <Check className="h-3 w-3 text-foreground/50" />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

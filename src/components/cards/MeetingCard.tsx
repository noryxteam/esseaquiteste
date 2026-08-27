import { MoreVertical } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MeetingCardProps {
  title: string;
  subtitle?: string;
  date?: string;
  time?: string;
  badge?: React.ReactNode;
  participants?: React.ReactNode;
  leadInitials?: string;
  leadName?: string;
  isActive?: boolean;
  compact?: boolean;
  menu?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MeetingCard({
  title,
  subtitle,
  date,
  time,
  badge,
  participants,
  leadInitials,
  leadName,
  isActive,
  compact,
  menu,
  onClick,
  className,
}: MeetingCardProps) {
  return (
    <BaseCard
      padding={compact ? "sm" : "md"}
      hover
      className={cn(
        "group relative",
        isActive && "border-l-2 border-l-foreground",
        className
      )}
    >
      {menu ?? (
        <Button
          variant="ghost"
          size="xs"
          className="absolute right-3 top-3 z-10 h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
          aria-label="Mais opções"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      )}

      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className={cn("pr-8 text-left", onClick && "cursor-pointer")}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
          )}
          {(date || time) && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              {[date, time].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {(participants || badge || leadInitials) && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {participants}
              {badge}
            </div>
            {leadInitials && (
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-elevated text-[9px] font-medium">
                  {leadInitials}
                </div>
                {leadName && (
                  <span className="hidden max-w-[100px] truncate text-[11px] text-muted-foreground sm:inline">
                    {leadName}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}

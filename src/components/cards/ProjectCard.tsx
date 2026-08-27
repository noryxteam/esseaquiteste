import { FolderKanban, MoreVertical } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  name: string;
  client?: string;
  stageLabel?: string;
  stageColor?: string;
  progress?: number;
  dueDate?: string;
  team?: React.ReactNode;
  icon?: React.ReactNode;
  menu?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({
  name,
  client,
  stageLabel,
  stageColor = "bg-white/50",
  progress,
  dueDate,
  team,
  icon,
  menu,
  onClick,
  className,
}: ProjectCardProps) {
  return (
    <BaseCard hover onClick={onClick} className={cn("group", className)}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
            {icon ?? <FolderKanban className="h-4 w-4 text-white" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{name}</p>
            {client && <p className="mt-0.5 truncate text-xs text-muted-foreground">{client}</p>}
          </div>
        </div>
        {menu ?? (
          <Button
            variant="ghost"
            size="xs"
            className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
      </div>

      {stageLabel && (
        <span className="mb-3 inline-flex items-center gap-1.5 text-[11px] text-foreground/70">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", stageColor)} />
          {stageLabel}
        </span>
      )}

      {progress !== undefined && <ProgressBar value={progress} className="mb-3" />}

      {(dueDate || team) && (
        <div className="flex items-center justify-between gap-2">
          {dueDate && <span className="text-[10px] text-muted-foreground">Entrega: {dueDate}</span>}
          {team}
        </div>
      )}
    </BaseCard>
  );
}

import { Building2, MoreVertical } from "lucide-react";
import { BaseCard } from "./BaseCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ClientCardProps {
  name: string;
  company?: string;
  email?: string;
  projectsCount?: number;
  revenue?: string;
  status?: React.ReactNode;
  avatar?: React.ReactNode;
  menu?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ClientCard({
  name,
  company,
  email,
  projectsCount,
  revenue,
  status,
  avatar,
  menu,
  onClick,
  className,
}: ClientCardProps) {
  return (
    <BaseCard hover onClick={onClick} className={cn("group", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          {avatar ?? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10">
              <Building2 className="h-4 w-4 text-foreground/80" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{name}</p>
            {company && <p className="mt-0.5 truncate text-xs text-muted-foreground">{company}</p>}
            {email && <p className="mt-1 truncate text-[11px] text-muted-foreground">{email}</p>}
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

      {(projectsCount !== undefined || revenue || status) && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-3">
          <div className="flex gap-4 text-[11px]">
            {projectsCount !== undefined && (
              <div>
                <p className="text-muted-foreground">Projetos</p>
                <p className="mt-0.5 font-medium tabular-nums text-foreground">{projectsCount}</p>
              </div>
            )}
            {revenue && (
              <div>
                <p className="text-muted-foreground">Receita</p>
                <p className="mt-0.5 font-medium tabular-nums text-foreground">{revenue}</p>
              </div>
            )}
          </div>
          {status}
        </div>
      )}
    </BaseCard>
  );
}

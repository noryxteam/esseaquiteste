import { cn } from "@/lib/utils";
import { resolveMemberKey } from "@/lib/react-keys";
import type { TeamMember } from "@/lib/mock-data/projetos-types";
interface ProjectAvatarGroupProps {
  members: TeamMember[];
  max?: number;
  size?: "sm" | "md";
}

export function ProjectAvatarGroup({ members, max = 3, size = "sm" }: ProjectAvatarGroupProps) {
  const visible = members.slice(0, max);
  const extra = members.length - max;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((member, index) => (
        <div
          key={resolveMemberKey(member, index)}          title={member.name}
          className={cn(
            "rounded-full bg-surface-elevated border border-border flex items-center justify-center font-medium text-foreground/70 shrink-0",
            size === "sm" ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]"
          )}
        >
          {member.initials}
        </div>
      ))}
      {extra > 0 && (
        <div
          className={cn(
            "rounded-full bg-surface-elevated border border-border flex items-center justify-center font-medium text-muted-foreground shrink-0",
            size === "sm" ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]"
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

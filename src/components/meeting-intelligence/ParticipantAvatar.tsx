import { cn } from "@/lib/utils";

interface ParticipantAvatarProps {
  initials: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-6 w-6 text-[9px]",
  md: "h-7 w-7 text-[10px]",
  lg: "h-8 w-8 text-[11px]",
};

export function ParticipantAvatar({ initials, name, size = "md", className }: ParticipantAvatarProps) {
  return (
    <div
      title={name}
      className={cn(
        "rounded-full bg-surface-elevated border border-border flex items-center justify-center font-medium text-foreground/80 shrink-0",
        SIZE_MAP[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

interface ParticipantAvatarGroupProps {
  participants: { id: string; initials: string; name: string }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function ParticipantAvatarGroup({ participants, max = 3, size = "md" }: ParticipantAvatarGroupProps) {
  const visible = participants.slice(0, max);
  const extra = participants.length - max;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((p) => (
        <ParticipantAvatar key={p.id} initials={p.initials} name={p.name} size={size} />
      ))}
      {extra > 0 && (
        <div
          className={cn(
            "rounded-full bg-surface-elevated border border-border flex items-center justify-center font-medium text-muted-foreground shrink-0",
            SIZE_MAP[size]
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

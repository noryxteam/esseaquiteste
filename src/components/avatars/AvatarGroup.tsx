import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import type { AvatarUser, Size } from "../common/types";
import { Avatar } from "./Avatar";

export interface AvatarGroupProps {
  users: AvatarUser[];
  max?: number;
  size?: Size;
  className?: string;
}

export function AvatarGroup({
  users,
  max = 3,
  size = "md",
  className,
}: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div className={cn("flex items-center -space-x-1.5", className)}>
      {visible.map((user, index) => (
        <Avatar
          key={user.id ?? `${user.name}-${index}`}
          user={user}
          size={size}
          className="ring-2 ring-surface"
        />
      ))}
      {extra > 0 && (
        <div
          className={cn(
            tokens.avatar.base,
            size === "xs" && tokens.avatar.xs,
            size === "sm" && tokens.avatar.sm,
            size === "md" && tokens.avatar.md,
            size === "lg" && tokens.avatar.lg,
            size === "xl" && tokens.avatar.xl,
            "text-muted-foreground ring-2 ring-surface"
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

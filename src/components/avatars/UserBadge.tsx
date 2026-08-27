import { cn } from "@/lib/utils";
import type { AvatarUser, Size } from "../common/types";
import { Avatar } from "./Avatar";

export interface UserBadgeProps {
  user: AvatarUser;
  subtitle?: string;
  size?: Size;
  className?: string;
}

export function UserBadge({ user, subtitle, size = "sm", className }: UserBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 min-w-0", className)}>
      <Avatar user={user} size={size} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

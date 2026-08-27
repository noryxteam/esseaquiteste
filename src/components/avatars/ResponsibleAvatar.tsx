import { cn } from "@/lib/utils";
import type { AvatarUser, Size } from "../common/types";
import { Avatar } from "./Avatar";

export interface ResponsibleAvatarProps {
  responsible: AvatarUser;
  size?: Size;
  showName?: boolean;
  className?: string;
}

export function ResponsibleAvatar({
  responsible,
  size = "sm",
  showName = false,
  className,
}: ResponsibleAvatarProps) {
  if (showName) {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <Avatar user={responsible} size={size} />
        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
          {responsible.name}
        </span>
      </div>
    );
  }

  return (
    <Avatar
      user={responsible}
      size={size}
      className={className}
    />
  );
}

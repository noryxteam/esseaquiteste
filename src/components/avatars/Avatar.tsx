import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import type { AvatarUser, Size } from "../common/types";

const AVATAR_SIZE: Record<Size, string> = {
  xs: tokens.avatar.xs,
  sm: tokens.avatar.sm,
  md: tokens.avatar.md,
  lg: tokens.avatar.lg,
  xl: tokens.avatar.xl,
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export interface AvatarProps {
  user?: AvatarUser;
  name?: string;
  initials?: string;
  imageUrl?: string;
  size?: Size;
  className?: string;
}

export function Avatar({
  user,
  name,
  initials,
  imageUrl,
  size = "md",
  className,
}: AvatarProps) {
  const displayName = name ?? user?.name ?? "";
  const displayInitials = initials ?? user?.initials ?? getInitials(displayName);
  const displayImage = imageUrl ?? user?.imageUrl;

  if (displayImage) {
    return (
      <img
        src={displayImage}
        alt={displayName}
        title={displayName}
        className={cn(
          tokens.avatar.base,
          "object-cover p-0",
          AVATAR_SIZE[size],
          className
        )}
      />
    );
  }

  return (
    <div
      title={displayName}
      aria-label={displayName}
      className={cn(tokens.avatar.base, AVATAR_SIZE[size], className)}
    >
      {displayInitials}
    </div>
  );
}

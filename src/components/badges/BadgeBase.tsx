import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import type { StatusColor } from "../common/types";

const DOT_COLORS: Record<StatusColor, string> = {
  default: tokens.state.dotNeutral,
  blue: tokens.state.dotBlue,
  green: tokens.state.dotGreen,
  orange: tokens.state.dotOrange,
  red: tokens.state.dotRed,
  purple: tokens.state.dotPurple,
  neutral: tokens.state.dotNeutral,
};

export interface BadgeBaseProps {
  label: string;
  color?: StatusColor;
  showDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function BadgeBase({
  label,
  color = "default",
  showDot = true,
  size = "md",
  className,
}: BadgeBaseProps) {
  return (
    <span
      className={cn(
        tokens.badge.base,
        size === "sm" && tokens.badge.sm,
        className
      )}
    >
      {showDot && (
        <span className={cn(tokens.badge.dot, DOT_COLORS[color])} aria-hidden />
      )}
      {label}
    </span>
  );
}

export { DOT_COLORS };

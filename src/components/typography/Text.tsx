import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import type { TextTone, TextWeight } from "../common/types";
import type { Size } from "../common/types";

const TEXT_SIZE: Record<Size, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const TEXT_WEIGHT: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
};

const TEXT_TONE: Record<TextTone, string> = {
  default: "text-foreground",
  secondary: "text-foreground-secondary",
  muted: "text-muted-foreground",
  danger: "text-state-red",
  success: "text-state-green",
};

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div";
  size?: Size;
  weight?: TextWeight;
  tone?: TextTone;
}

export function Text({
  as: Component = "p",
  size = "md",
  weight = "normal",
  tone = "default",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        tokens.typography.text,
        TEXT_SIZE[size],
        TEXT_WEIGHT[weight],
        TEXT_TONE[tone],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

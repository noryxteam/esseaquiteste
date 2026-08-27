import { cn } from "@/lib/utils";

export interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
  as?: "div" | "article" | "section";
}

const PADDING = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
} as const;

/** Card base do design system — variantes de padding e hover. */
export function BaseCard({
  children,
  className,
  padding = "md",
  hover = false,
  onClick,
  as: Tag = "div",
}: BaseCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-lg border border-border-subtle bg-surface/60",
        PADDING[padding],
        hover && "hover:border-border hover:bg-surface-hover/60 transition-colors",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Tag>
  );
}

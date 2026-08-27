import { cn } from "@/lib/utils";
import { tokens } from "./tokens";
import type { BaseComponentProps, SlotProps } from "./types";

export interface BaseCardProps extends BaseComponentProps {
  padding?: boolean;
  hover?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function BaseCard({
  children,
  className,
  padding = true,
  hover = false,
  header,
  footer,
}: BaseCardProps) {
  return (
    <div
      className={cn(
        tokens.card.base,
        padding && "p-5",
        hover && tokens.card.hover,
        className
      )}
    >
      {header && <BaseCardHeader>{header}</BaseCardHeader>}
      {children && <BaseCardBody>{children}</BaseCardBody>}
      {footer && <BaseCardFooter>{footer}</BaseCardFooter>}
    </div>
  );
}

export function BaseCardHeader({ children, className }: SlotProps) {
  return (
    <div className={cn(tokens.card.header, "mb-4", className)}>
      {children}
    </div>
  );
}

export function BaseCardBody({ children, className }: SlotProps) {
  return <div className={cn(tokens.card.body, className)}>{children}</div>;
}

export function BaseCardFooter({ children, className }: SlotProps) {
  return <div className={cn(tokens.card.footer, className)}>{children}</div>;
}

export function BaseCardTitle({
  children,
  className,
  subtitle,
}: SlotProps & { subtitle?: string }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-foreground">{children}</h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

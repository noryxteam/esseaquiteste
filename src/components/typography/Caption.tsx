import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";

export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Caption({ className, children, ...props }: CaptionProps) {
  return (
    <span className={cn(tokens.typography.caption, className)} {...props}>
      {children}
    </span>
  );
}

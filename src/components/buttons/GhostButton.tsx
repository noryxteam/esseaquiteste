import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import { NoraxButton, type NoraxButtonBaseProps } from "./button-utils";

export type GhostButtonProps = NoraxButtonBaseProps;

export function GhostButton({ className, variant: _variant, ...props }: GhostButtonProps) {
  return (
    <NoraxButton
      variant="ghost"
      className={cn(tokens.button.ghost, tokens.radius.md, className)}
      {...props}
    />
  );
}

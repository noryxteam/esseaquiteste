import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import { NoraxButton, type NoraxButtonBaseProps } from "./button-utils";

export type OutlineButtonProps = NoraxButtonBaseProps;

export function OutlineButton({ className, variant: _variant, ...props }: OutlineButtonProps) {
  return (
    <NoraxButton
      variant="outline"
      className={cn(tokens.button.outline, tokens.radius.md, className)}
      {...props}
    />
  );
}

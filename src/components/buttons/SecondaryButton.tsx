import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import { NoraxButton, type NoraxButtonBaseProps } from "./button-utils";

export type SecondaryButtonProps = NoraxButtonBaseProps;

export function SecondaryButton({ className, variant: _variant, ...props }: SecondaryButtonProps) {
  return (
    <NoraxButton
      variant="outline"
      className={cn(tokens.button.secondary, tokens.radius.md, className)}
      {...props}
    />
  );
}

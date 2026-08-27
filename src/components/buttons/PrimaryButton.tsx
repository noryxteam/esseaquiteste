import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import { NoraxButton, type NoraxButtonBaseProps } from "./button-utils";

export type PrimaryButtonProps = NoraxButtonBaseProps;

export function PrimaryButton({ className, variant: _variant, ...props }: PrimaryButtonProps) {
  return (
    <NoraxButton
      variant="default"
      className={cn(tokens.button.primary, tokens.radius.md, className)}
      {...props}
    />
  );
}

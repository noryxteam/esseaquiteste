import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import { NoraxButton, type NoraxButtonBaseProps } from "./button-utils";

export type SuccessButtonProps = NoraxButtonBaseProps;

export function SuccessButton({ className, variant: _variant, ...props }: SuccessButtonProps) {
  return (
    <NoraxButton
      variant="outline"
      className={cn(tokens.button.success, tokens.radius.md, className)}
      {...props}
    />
  );
}

import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import { NoraxButton, type NoraxButtonBaseProps } from "./button-utils";

export type DangerButtonProps = NoraxButtonBaseProps;

export function DangerButton({ className, variant: _variant, ...props }: DangerButtonProps) {
  return (
    <NoraxButton
      variant="outline"
      className={cn(tokens.button.danger, tokens.radius.md, className)}
      {...props}
    />
  );
}

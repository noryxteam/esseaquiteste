import { cn } from "@/lib/utils";
import { tokens } from "../common/tokens";
import type { NoraxTextareaProps, Size } from "../common/types";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";

export type TextareaProps = NoraxTextareaProps;

export function Textarea({
  className,
  size = "md",
  error,
  label,
  hint,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <textarea
        rows={rows}
        className={cn(
          tokens.input.base,
          "min-h-[80px] resize-y py-2",
          inputSizeClass(size),
          error && "border-state-red/50 focus-visible:ring-state-red/20",
          className
        )}
        {...props}
      />
    </InputFieldWrapper>
  );
}

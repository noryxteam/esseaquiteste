import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import type { NoraxInputProps } from "../common/types";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";
import { formatDateInput, stripNonDigits } from "./formatters";

export interface DateInputProps extends Omit<NoraxInputProps, "type" | "onChange" | "value"> {
  value?: string;
  /** Raw digits (ddmmyyyy) */
  onValueChange?: (digits: string) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function DateInput({
  className,
  size = "md",
  error,
  label,
  hint,
  value = "",
  onValueChange,
  onChange,
  ...props
}: DateInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = stripNonDigits(event.target.value).slice(0, 8);
    const formatted = formatDateInput(digits);
    event.target.value = formatted;
    onValueChange?.(digits);
    onChange?.(event);
  }

  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <ShadcnInput
        type="text"
        inputMode="numeric"
        value={formatDateInput(value)}
        onChange={handleChange}
        placeholder="dd/mm/aaaa"
        className={cn(
          inputSizeClass(size),
          "tabular-nums",
          error && "border-state-red/50 focus-visible:ring-state-red/20",
          className
        )}
        {...props}
      />
    </InputFieldWrapper>
  );
}

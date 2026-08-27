import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import type { NoraxInputProps } from "../common/types";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";
import { formatCurrencyInput, parseCurrencyInput } from "./formatters";

export interface CurrencyInputProps extends Omit<NoraxInputProps, "type" | "onChange" | "value"> {
  value?: number;
  onValueChange?: (value: number) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function CurrencyInput({
  className,
  size = "md",
  error,
  label,
  hint,
  value,
  onValueChange,
  onChange,
  ...props
}: CurrencyInputProps) {
  const displayValue =
    value !== undefined ? formatCurrencyInput(String(Math.round(value * 100))) : undefined;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrencyInput(event.target.value);
    event.target.value = formatted;
    onValueChange?.(parseCurrencyInput(formatted));
    onChange?.(event);
  }

  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <ShadcnInput
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
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

import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import type { NoraxInputProps } from "../common/types";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";
import { formatNumberInput, parseNumberInput } from "./formatters";

export interface NumberInputProps extends Omit<NoraxInputProps, "type" | "onChange" | "value"> {
  value?: number;
  onValueChange?: (value: number) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function NumberInput({
  className,
  size = "md",
  error,
  label,
  hint,
  value,
  onValueChange,
  onChange,
  ...props
}: NumberInputProps) {
  const displayValue =
    value !== undefined
      ? formatNumberInput(value.toString().replace(".", ","))
      : undefined;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatNumberInput(event.target.value);
    event.target.value = formatted;
    onValueChange?.(parseNumberInput(formatted));
    onChange?.(event);
  }

  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <ShadcnInput
        type="text"
        inputMode="decimal"
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

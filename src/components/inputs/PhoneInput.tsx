import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import type { NoraxInputProps } from "../common/types";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";
import { formatPhone, stripNonDigits } from "./formatters";

export interface PhoneInputProps extends Omit<NoraxInputProps, "type" | "onChange" | "value"> {
  value?: string;
  onValueChange?: (digits: string) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function PhoneInput({
  className,
  size = "md",
  error,
  label,
  hint,
  value = "",
  onValueChange,
  onChange,
  ...props
}: PhoneInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = stripNonDigits(event.target.value).slice(0, 11);
    const formatted = formatPhone(digits);
    event.target.value = formatted;
    onValueChange?.(digits);
    onChange?.(event);
  }

  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <ShadcnInput
        type="tel"
        inputMode="tel"
        value={formatPhone(value)}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        className={cn(
          inputSizeClass(size),
          error && "border-state-red/50 focus-visible:ring-state-red/20",
          className
        )}
        {...props}
      />
    </InputFieldWrapper>
  );
}

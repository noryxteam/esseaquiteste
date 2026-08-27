import { Input as ShadcnInput } from "@/components/ui/input-shadcn";
import { cn } from "@/lib/utils";
import type { NoraxInputProps } from "../common/types";
import { InputFieldWrapper } from "./Input";
import { inputSizeClass } from "./Input";
import { formatCNPJ, stripNonDigits } from "./formatters";

export interface CNPJInputProps extends Omit<NoraxInputProps, "type" | "onChange" | "value"> {
  value?: string;
  onValueChange?: (digits: string) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function CNPJInput({
  className,
  size = "md",
  error,
  label,
  hint,
  value = "",
  onValueChange,
  onChange,
  ...props
}: CNPJInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = stripNonDigits(event.target.value).slice(0, 14);
    const formatted = formatCNPJ(digits);
    event.target.value = formatted;
    onValueChange?.(digits);
    onChange?.(event);
  }

  return (
    <InputFieldWrapper label={label} hint={hint} error={error}>
      <ShadcnInput
        type="text"
        inputMode="numeric"
        value={formatCNPJ(value)}
        onChange={handleChange}
        placeholder="00.000.000/0000-00"
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
